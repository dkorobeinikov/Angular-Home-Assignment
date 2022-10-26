import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Observable, of } from "rxjs";
import { IPost } from "../../types";
import { AutocompleteInputComponent } from "./autocomplete-input.component";

const ITEMS = [
    "Atlanta Hawks",
    "Brooklyn Nets",
    "Los Angeles Clippers",
    "Los Angeles Lakers",
    "Golden State Warriors",
    "Chicago Bulls",
    "Boston Celtics",
];

describe("Autocomplete Input", () => {

    let autocompleteComponent: AutocompleteInputComponent<string>;
    let fixture: ComponentFixture<AutocompleteInputComponent<string>>;

    let loadSpy: jasmine.SpyObj<(searchTerm: string) => Observable<string[]>>;

    beforeEach(() => {

        fixture = TestBed.createComponent(AutocompleteInputComponent<string>);

        const load = (searchTerm: string) => {
            console.log("search for: ", searchTerm);
            return of(ITEMS.filter(item => item.includes(searchTerm)));
        };
        loadSpy = jasmine.createSpy().and.callFake(load);
        fixture.componentInstance.load$ = loadSpy;
        fixture.componentInstance.debounceTime = 200;

    });

    it("input is empty by default", () => {

        const input = fixture.debugElement.query(By.css("input")).nativeElement as HTMLInputElement;
        expect(input.value).toBe("");

    });


    it("Load has been called when the input has been updated", fakeAsync(() => {

        fixture.componentInstance.ngOnInit();

        const input = fixture.debugElement.query(By.css("input")).nativeElement as HTMLInputElement;
        expect(loadSpy).not.toHaveBeenCalled();

        fixture.detectChanges();
        tick();

        input.value = "Los Angeles";
        input.dispatchEvent(new Event("input"));

        tick(190)
        fixture.detectChanges();
        expect(loadSpy).not.toHaveBeenCalled();

        tick(20);
        fixture.detectChanges();
        expect(loadSpy).toHaveBeenCalled();

    }));

});
