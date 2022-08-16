import { Directive, Input } from "@angular/core";

export type Sortable = "none" | "asc" | "desc" | "disabled";
export interface IColumnDefinition<T> {
    name: string;
    property: keyof T;
    sortBy: Sortable;
}

@Directive({
    selector: "t-column",
})
export class TableColumnComponent<T> {
    @Input() name!: string;
    @Input() property!: keyof T;
    @Input() sortable!: boolean;

    public getName(): string {
        return this.name;
    }
}
