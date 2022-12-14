import { Component, Input, QueryList, AfterViewInit, ContentChildren, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { combineLatest, isObservable, map, Observable, ReplaySubject, tap } from "rxjs";
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableGridComponent<T> implements AfterViewInit, OnInit {
    @Input()
    public set data(value: T[] | Observable<T[]>) {
        if (isObservable(value)) {
            value.subscribe((data) => this._dataSubject?.next(data));
        }
        else {
            this._dataSubject.next(value);
        }
    }

    private _dataSubject  = new ReplaySubject<T[]>;
    public data$ = this._dataSubject.asObservable();

    private _dataLength = 0;

    public visibleData$ = combineLatest([
        this.data$,
        // this.selectedPageSize$,
        // this.currentPage$,
    ]).pipe(
        tap(([data]) => { console.log(data) }),
        map(([data]) => {
            if (this.paginationStrategy === "controlled" || !this.selectedPageSize) {
                return data;
            }

            let sortedRecords = [...data];
            const sortedByProperty = this.columnDefinitions.find(cd => cd.sortBy === "asc" || cd.sortBy === "desc");
            if (sortedByProperty) {
                sortedRecords = sortBy(sortedRecords, sortedByProperty.property, sortedByProperty.sortBy === "asc" ? "asc" : "desc");
            }


            return getPage(sortedRecords, this.selectedPageSize, this.currentPage);
        }),
    );

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

    public selectedPageSize: number | null = null;

    public currentPage: number = 1;

    public get paginationStrategy(): PaginationStrategy {
        if (!this.total) {
            return "uncontrolled";
        }

        return "controlled";
    }

    public get totalRecords(): number {
        if (!this.total) {
            return this._dataLength;
        }

        return this.total;
    }

    public get firstVisibleRecordNumber(): number {
        if (!this.selectedPageSize) {
            return 1;
        }
        return this.selectedPageSize * (this.currentPage - 1) + 1;
    }

    public get lastVisibleRecordNumber(): number {
        if (!this.selectedPageSize) {
            return this.totalRecords;
        }

        return Math.min(this.totalRecords, this.firstVisibleRecordNumber - 1 + this.selectedPageSize);
    }

    public constructor() {

    }

    public ngOnInit() {
        this.selectedPageSize = this.pageSize;

        this.data$.pipe(tap((data) => {
            console.log("data length: ", data.length);
            this._dataLength = data.length;
        })).subscribe();
    }

    public ngAfterViewInit(): void {
        this.refreshColumnDefinitions();
        this.columnViews.changes.subscribe((columnViews) => {
            this.refreshColumnDefinitions();
        });
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

        // this._updateVisibleData();
        this.sortChange.emit({
            columnName: column.property,
            direction: column.sortBy === "asc" ? Direction.Ascending : Direction.Descending,
        });
    }

    public handleRequestPage(pageNumber: number) {
        this.currentPage = pageNumber;

        this.paginationChange.emit({ currentPage: pageNumber, pageSize: this.selectedPageSize });
    }

    public handlePageSizeSelect(event: Event) {
        const parsedInt = parseInt((event.target as any)?.value);
        const value: number | null = isNaN(parsedInt) ? null : parsedInt;

        this.selectedPageSize = value;
        this.paginationChange.emit({ currentPage: this.currentPage, pageSize: this.selectedPageSize });
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
