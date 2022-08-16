import { Directive, Input } from "@angular/core";

export interface IColumnDefinition<T> {
    name: string;
    property: keyof T;
    sortable: boolean;
}

@Directive({
    selector: "t-column",
})
export class TableColumnComponent<T> implements IColumnDefinition<T> {
    @Input() name!: string;
    @Input() property!: keyof T;
    @Input() sortable!: boolean;

    public getName(): string {
        return this.name;
    }
}
