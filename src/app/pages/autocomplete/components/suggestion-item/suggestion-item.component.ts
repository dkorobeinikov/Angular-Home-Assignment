import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "autocomplete-suggestion-item",
    template: `
        <h4 class="title">{{title}}</h4>
        <p *ngIf="!!body" class="body">{{body}}</p>
    `,
    styles: [
        `
            .suggestion-item {
                list-style: none;
                padding: 16px;
            }

            .suggestion-item:nth-child(even) {
                background-color: #f8f6ff;
            }

            .title {
                font-weight: 600;
            }
            .body {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        `
    ],
    imports: [CommonModule],
    standalone: true,
})
export class SuggestionItemComponent {
    @Input() public title!: string ;
    @Input() public body: string = "";

    @Output() onClick = new EventEmitter();
}
