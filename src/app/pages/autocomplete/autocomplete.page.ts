import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BehaviorSubject, combineLatest, debounce, debounceTime, map, tap } from "rxjs";

import { PostsService } from "./services/postsService";

@Component({
    templateUrl: "./autocomplete.page.html",
    styleUrls: ["./autocomplete.page.css"],
    standalone: true,
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    providers: [
        PostsService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompletePage {

    private autocompleteInputValueSubject = new BehaviorSubject<string>("");
    public autocompleteInputValue$ = this.autocompleteInputValueSubject.asObservable();

    public autocompleteItems$ = combineLatest([
        this.autocompleteInputValue$,
        this.posts.posts$,
    ]).pipe(
        tap(([searchTerm, posts]) => {
            console.log("serch term: ", searchTerm);
        }),
        debounceTime(500),
        map(([searchTerm, posts]) => {
            if (!searchTerm || searchTerm.length < 3) {
                return [];
            }
            return posts.filter(post => {
                return post.title?.includes(searchTerm) || post.body?.includes(searchTerm);
            });
        }),
        tap((filteredPosts) => {
            console.log(filteredPosts);
        }),
    );

    public constructor(
        private posts: PostsService,
    ) {
    }

    public handleChange($event: Event) {
        console.log("handle change");
        this.autocompleteInputValueSubject.next(($event.target as HTMLInputElement)?.value);
    }


}
