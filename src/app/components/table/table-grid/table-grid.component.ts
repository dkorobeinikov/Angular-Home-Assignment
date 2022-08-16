import { Component, Input, QueryList, AfterViewInit, AfterContentChecked, ContentChildren, Output, EventEmitter } from "@angular/core";
import { IColumnDefinition, TableColumnComponent } from "./table-column.directive";

export enum Direction {
    Ascending = "Ascending",
    Descending = "Descending",
}

export interface ISortChangeEventArgs<T> {
    columnName: keyof T;
    direction: Direction;
}

@Component({
    selector: "t-grid",
    templateUrl: "./table-grid.component.html",
    styleUrls: ["./table-grid.component.css"],
})
export class TableGridComponent<T> implements AfterViewInit, AfterContentChecked {
    @Input()
    public data: T[] = [];

    @Input()
    public sortable = true;

    @Output()
    public sortChange = new EventEmitter<ISortChangeEventArgs<T>>();


    @ContentChildren(TableColumnComponent<T>)
    public columnViews!: QueryList<TableColumnComponent<T>>;
    public columnDefinitions: IColumnDefinition<T>[] = [];

    public constructor() {

    }

    public ngAfterViewInit(): void {
        this.refreshColumnDefinitions();
        this.columnViews.changes.subscribe((columnViews) => {
            this.refreshColumnDefinitions();
        });
    }

    public ngAfterContentChecked(): void {
        console.log(this.data);
    }

    public refreshColumnDefinitions() {
        setTimeout(() => {
            this.columnDefinitions = this.columnViews.map(view => ({
                name: view.name,
                property: view.property,
                sortBy: view.sortable ? "none" : "disabled",
            }))
        }, 0);
    }

    public getHeaderClasses(column: IColumnDefinition<T>) {

        return {
            'sortable': column.sortBy !== "disabled",
            'asc-disabled': column.sortBy === "asc",
            'desc-disabled': column.sortBy === "desc",
        }

    }

    public handleHeaderColumnClick(event: MouseEvent, column: IColumnDefinition<T>) {
        if (column.sortBy === "disabled") {
            return;
        }

        if (column.sortBy === "none" || column.sortBy === "desc") {
            column.sortBy = "asc";
        } else {
            column.sortBy = "desc";
        }

        this.columnDefinitions.forEach(columnDefinition => {
            if (columnDefinition.property !== column.property) {
                columnDefinition.sortBy = "none";
            }
        });

        this.sortChange.emit({
            columnName: column.property,
            direction: column.sortBy === "asc" ? Direction.Ascending : Direction.Descending,
        })
    }

}
