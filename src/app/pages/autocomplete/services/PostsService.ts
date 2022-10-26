import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"
import { IPost } from "../types";
import { delay, map, shareReplay, tap } from "rxjs";

@Injectable()
export class PostsService {

    public id = window.crypto.randomUUID();

    public constructor(
        private http: HttpClient,
    ) {
        console.log("posts service: ", this.id);
    }

    public posts$ = this.http.get<IPost[]>(`https://jsonplaceholder.typicode.com/posts`)
        .pipe(
            tap(() => {
                console.log("get posts")
            }),
            shareReplay(1),
        );

    public search(searchTerm: string) {
        return this.posts$.pipe(
            delay(500),
            map((posts) => {
                return posts.filter((post) => {
                    return post.title?.includes(searchTerm) || post.body?.includes(searchTerm)
                })
            }),
        );
    }

}
