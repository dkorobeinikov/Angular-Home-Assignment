import { Component, Input } from "@angular/core";

@Component({
    selector: "t-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.css"],
})
export class CardComponent {

    @Input()
    public title: string = "";

    @Input()
    public backgroundImage: string = "";

    @Input()
    public description: string = "";
}
