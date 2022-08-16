import { Component, Input, QueryList, AfterViewInit, AfterContentChecked, ContentChildren, Output, EventEmitter } from "@angular/core";
import { getPage, sortBy } from "src/app/helpers/data-helper";
import { IColumnDefinition, TableColumnComponent } from "./table-column.directive";

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
    selector: "t-grid",
    templateUrl: "./table-grid.component.html",
    styleUrls: ["./table-grid.component.css"],
})
export class TableGridComponent<T> implements AfterViewInit, AfterContentChecked {
    @Input()
    public data: T[] = [];

    @Input()
    public sortable = true;

    @Input()
    public pageSize: number | null = null;

    @Input()
    public total: number | null = null;

    @Output()
    public sortChange = new EventEmitter<ISortChangeEventArgs<T>>();

    @Output()
    public performFetch = new EventEmitter<ISortChangeEventArgs<T>>();


    @ContentChildren(TableColumnComponent<T>)
    public columnViews!: QueryList<TableColumnComponent<T>>;
    public columnDefinitions: IColumnDefinition<T>[] = [];

    public currentPage: number = 1;

    public get paginationStrategy(): PaginationStrategy {
        if (this.total === null) {
            return "uncontrolled";
        }

        return "controlled";
    }

    public get totalRecords(): number {
        if (this.total === null) {
            return this.data.length;
        }

        return this.total;
    }

    public get totalPages(): number {
        if (this.pageSize === null) {
            return 1;
        }

        return Math.ceil(this.totalRecords / this.pageSize);
    }

    public get hasNextPage(): boolean {
        return this.totalPages > this.currentPage;
    }

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

    public getRecords() {

        if (this.paginationStrategy === "controlled" || this.pageSize === null) {
            return this.data;
        }

        let sortedRecords = [...this.data];
        const sortedByProperty = this.columnDefinitions.find(cd => cd.sortBy === "asc" || cd.sortBy === "desc");
        if (sortedByProperty) {
            sortedRecords = sortBy(sortedRecords, sortedByProperty.property, sortedByProperty.sortBy === "asc" ? "asc" : "desc");
        }

        return getPage(sortedRecords, this.pageSize, this.currentPage);

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

        this._setColumnsSortBy(column);

        this.sortChange.emit({
            columnName: column.property,
            direction: column.sortBy === "asc" ? Direction.Ascending : Direction.Descending,
        });
    }

    private _setColumnsSortBy(column: IColumnDefinition<T>) {

        if (column.sortBy === "none" || column.sortBy === "desc") {
            column.sortBy = "asc";
        } else {
            column.sortBy = "desc";
        }

        this.columnDefinitions.filter(columnDefinition => columnDefinition.sortBy !== "disabled")
            .forEach(columnDefinition => {
                if (columnDefinition.property !== column.property) {
                    columnDefinition.sortBy = "none";
                }
            });

    }

}
