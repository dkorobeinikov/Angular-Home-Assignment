import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { IPost } from "../types";
import { PostsService } from "./PostsService";

const POSTS: IPost[] = [
    {
        id: 1,
        body: "Post 1 body",
        title: "Post 1",
        userId: 1,
    },
    {
        id: 2,
        body: "Post 2 body",
        title: "Post 2",
        userId: 2,
    },
];

describe("Post Service", () => {

    let postsService: PostsService;
    let httpClientMock: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        httpClientMock = jasmine.createSpyObj<HttpClient>("HttpClient", ["get"]);
        httpClientMock.get.and.returnValue(of<IPost[]>(POSTS));

        postsService = new PostsService(httpClientMock);
    });

    it("Calls Posts api", () => {

        postsService.posts$.subscribe(posts => {
            expect(posts).toEqual(POSTS);
        });

    });

    describe("search", () => {

        it("Searches posts by given term", (done) => {

            postsService.seach("2").subscribe(posts => {
                expect(posts.length).toEqual(1);
                expect(posts[0]).toEqual(POSTS[1]);
                done();
            });

        });

    });


});
