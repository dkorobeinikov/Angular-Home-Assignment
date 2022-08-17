import { Component, Input, QueryList, AfterViewInit, ContentChildren, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { isObservable, Observable } from "rxjs";
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

export interface IPaginationChangeEventArgs {
    currentPage: number;
    pageSize: number | null;
}

export type PaginationStrategy = "controlled" | "uncontrolled";

@Component({
    selector: "t-grid",
    templateUrl: "./table-grid.component.html",
    styleUrls: ["./table-grid.component.css"],
})
export class TableGridComponent<T> implements AfterViewInit, OnChanges {
    @Input()
    public data: T[] | Observable<T[]> = [];

    private _data: T[] = [];
    public visibleData: T[] = [];

    @Input()
    public sortable = true;

    @Input()
    public pageSize: number | null = null;

    @Input()
    public total: number | null = null;

    @Output()
    public sortChange = new EventEmitter<ISortChangeEventArgs<T>>();

    @Output()
    public paginationChange = new EventEmitter<IPaginationChangeEventArgs>();


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
            return this._data.length;
        }

        return this.total;
    }

    public constructor() {

    }

    public ngAfterViewInit(): void {
        this.refreshColumnDefinitions();
        this.columnViews.changes.subscribe((columnViews) => {
            this.refreshColumnDefinitions();
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["data"] && changes["data"].previousValue !== changes["data"].currentValue) {
            if (isObservable(this.data)) {
                this.data.subscribe((data) => {
                    this._data = [...data];
                    this._updateVisibleData()
                });
            }
            else {
                this._data = [...this.data];
                this._updateVisibleData();
            }
        }
    }

    public refreshColumnDefinitions() {
        setTimeout(() => {
            this.columnDefinitions = this.columnViews.map(view => ({
                name: view.name,
                property: view.property,
                sortBy: this.sortable && view.sortable ? "none" : "disabled",
            }))
        }, 0);
    }

    private getRecords() {

        if (this.paginationStrategy === "controlled" || this.pageSize === null) {
            return this._data;
        }

        let sortedRecords = [...this._data];
        const sortedByProperty = this.columnDefinitions.find(cd => cd.sortBy === "asc" || cd.sortBy === "desc");
        if (sortedByProperty) {
            sortedRecords = sortBy(sortedRecords, sortedByProperty.property, sortedByProperty.sortBy === "asc" ? "asc" : "desc");
        }

        return getPage(sortedRecords, this.pageSize, this.currentPage);

    }

    private _updateVisibleData() {
        this.visibleData = this.getRecords();
    }

    public getHeaderClasses(column: IColumnDefinition<T>) {

        return {
            'sortable': column.sortBy !== "disabled",
            'asc-disabled': column.sortBy === "asc",
            'desc-disabled': column.sortBy === "desc",
        }

    }

    public handleHeaderColumnClick(column: IColumnDefinition<T>) {
        if (column.sortBy === "disabled") {
            return;
        }

        this._setColumnsSortBy(column);

        this._updateVisibleData();
        this.sortChange.emit({
            columnName: column.property,
            direction: column.sortBy === "asc" ? Direction.Ascending : Direction.Descending,
        });
    }

    public handleRequestPage(pageNumber: number) {
        if (this.paginationStrategy === "uncontrolled") {
            this.currentPage = pageNumber;
        }
        this._updateVisibleData();
        this.paginationChange.emit({ currentPage: pageNumber, pageSize: this.pageSize });
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
