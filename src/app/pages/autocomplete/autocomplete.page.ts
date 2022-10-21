import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BehaviorSubject, combineLatest, debounce, debounceTime, filter, map, tap } from "rxjs";
import { AutocompleteInputComponent } from "./components/autocomplete-input/autocomplete-input.component";
import { SuggestionItemComponent } from "./components/suggestion-item/suggestion-item.component";

import { PostsService } from "./services/PostsService";
import { IPost } from "./types";

@Component({
    templateUrl: "./autocomplete.page.html",
    styleUrls: ["./autocomplete.page.css"],
    standalone: true,
    imports: [
        CommonModule,
        HttpClientModule,
        SuggestionItemComponent,
        AutocompleteInputComponent,
    ],

    providers: [
        PostsService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompletePage {

    private addedItemsIdsSubject = new BehaviorSubject<Set<number>>(new Set([]));
    private addedItemsIds = this.addedItemsIdsSubject.asObservable();

    public posts$ = this.posts.posts$;

    public addedItems$ = combineLatest([
        this.addedItemsIds,
        this.posts$,
    ]).pipe(
        map(([ids, posts]) => {
            return posts.filter(post => ids.has(post.id));
        }),
    );

    public constructor(
        private posts: PostsService,
    ) {

        this.isValidForAutocompletion = this.isValidForAutocompletion.bind(this);
    }

    public handleSuggestionItemClick(_$event: Event, id: number) {
        if (!id) {
            return;
        }

        const nextSet = new Set(this.addedItemsIdsSubject.value);
        nextSet.add(id);
        this.addedItemsIdsSubject.next(
            nextSet,
        )
    }

    public isValidForAutocompletion(post: IPost, searchTerm: string): boolean {

        return !this.addedItemsIdsSubject.value.has(post.id) &&
            (post.title?.includes(searchTerm) || post.body?.includes(searchTerm));

    }

}
