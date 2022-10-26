import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BehaviorSubject, combineLatest, debounceTime as rxDebounceTime, map, Observable, startWith, switchMap, tap } from "rxjs";

import {
    UntilDestroy, untilDestroyed,
} from '@ngneat/until-destroy';

export type SearchPredicate<T> = (item: T, searchTerm: string) => boolean;
export type LoadAutocompleteItems<T> = (searchTerm: string) => Observable<T[]>;

@UntilDestroy()
@Component({
    selector: "autocomplete-input",
    templateUrl: "./autocomplete-input.component.html",
    styleUrls: [
        "./autocomplete-input.component.css",
    ],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteInputComponent<T> implements OnInit {

    @Input() control: FormControl = new FormControl();

    @ContentChild(TemplateRef, {static: true})
    itemTemplateRef!: TemplateRef<{ item: T }>;

    @Input() load$!: LoadAutocompleteItems<T>;

    @Input() minimumSearchLentgh = 0;
    @Input() debounceTime = 500;

    @Output() onItemSelected = new EventEmitter<T>();

    private autocompleteInputValueSubject = new BehaviorSubject<string>("");
    public autocompleteInputValue$ = this.autocompleteInputValueSubject.asObservable();

    private autocompleteItemsSubject = new BehaviorSubject<T[]>([]);
    public autocompleteItems$ = this.autocompleteItemsSubject.asObservable();

    public isVisible$ = this.autocompleteItems$.pipe(map((items) => items.length > 0));

    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoadingSubject.asObservable();

    public constructor(
    ) {

    }

    public ngOnInit(): void {

        combineLatest([
            this.control.valueChanges.pipe(
                startWith(this.control.value),
                map((value: string | null) => value ?? ''),
                tap(value => {
                    this.autocompleteItemsSubject.next([]);
                    this.isLoadingSubject.next(value.length >= this.minimumSearchLentgh);
                })
            ),
        ]).pipe(
            rxDebounceTime(this.debounceTime),
            switchMap(([ searchTerm ]) => {
                if (searchTerm.length < this.minimumSearchLentgh) {
                    return [];
                }

                return this.load$(searchTerm);
            }),
            tap(() => this.isLoadingSubject.next(false)),
            untilDestroyed(this),
        ).subscribe((items) => {
            this.autocompleteItemsSubject.next(items);
        });

    }

    public handleSelectItem(_$event: Event, item: T) {

        this.onItemSelected.emit(item);
        this.autocompleteItemsSubject.next([]);

    }

}
