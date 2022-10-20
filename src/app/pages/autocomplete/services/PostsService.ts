import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"
import { IPost } from "../types";

@Injectable()
export class PostsService {

    public constructor(
        private http: HttpClient,
    ) {}

    public posts$ = this.http.get<IPost[]>(`https://jsonplaceholder.typicode.com/posts`);

}
