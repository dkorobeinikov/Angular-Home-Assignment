import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { IColumnDefinition } from "../table-grid/table-column.directive";

export enum Direction {
    Ascending = "Ascending",
    Descending = "Descending",
}

export interface ISortChangeEventArgs<T> {
    columnName: keyof T;
    direction: Direction;
}

export type PaginationStrategy = "controlled" | "uncontrolled";

@Component({
    selector: "t-table-view",
    templateUrl: "./table-view.component.html",
    styleUrls: ["./table-view.component.css"],
    imports: [
        CommonModule,
    ],
    standalone: true,
})
export class TableViewComponent<T>  {
    @Input()
    public data$!: Observable<T[]>;

    @Input()
    public columnDefinitions: IColumnDefinition<T>[] = [];

    @Output()
    public columnHeaderClicked = new EventEmitter<IColumnDefinition<T>>();

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

        this.columnHeaderClicked.emit(column)
    }

}
