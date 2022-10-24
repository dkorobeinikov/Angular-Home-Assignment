import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BehaviorSubject, combineLatest, debounceTime as rxDebounceTime, map, Observable, startWith, tap } from "rxjs";
import { IPost } from "../../types";

export type SearchPredicate<T> = (item: T, searchTerm: string) => boolean;

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

    @Input() source$!: Observable<T[]>;
    @Input() searchPredicate!: SearchPredicate<T>;

    @Input() minimumSearchLentgh = 0;
    @Input() debounceTime = 500;

    @Output() onItemSelected = new EventEmitter<T>();

    private isVisibleSubject = new BehaviorSubject<boolean>(false);
    public isVisible$ = this.isVisibleSubject.asObservable();

    private autocompleteInputValueSubject = new BehaviorSubject<string>("");
    public autocompleteInputValue$ = this.autocompleteInputValueSubject.asObservable();

    private autocompleteItemsSubject = new BehaviorSubject<T[]>([]);
    public autocompleteItems$ = this.autocompleteItemsSubject.asObservable();

    public constructor() {

    }

    public ngOnInit(): void {

        combineLatest([
            this.control.valueChanges.pipe(
                startWith(this.control.value),
                map((value: string | null) => value ?? ''),
            ),
            this.source$,
        ]).pipe(
            tap(([searchTerm]) => {
                console.log("serch term: ", searchTerm);
            }),
            rxDebounceTime(this.debounceTime),
            map(([searchTerm, items]) => {
                if (!searchTerm || searchTerm.length < this.minimumSearchLentgh) {
                    return [];
                }
                return items.filter(item => this.searchPredicate(item, searchTerm));
            }),
            tap((items) => {
                this.isVisibleSubject.next(items.length > 0);
                console.log(items);
            }),
        ).subscribe((items) => {
            this.autocompleteItemsSubject.next(items);
        });

    }

    public handleSelectItem(_$event: Event, item: T) {

        this.onItemSelected.emit(item);
        this.isVisibleSubject.next(false);

    }

}
