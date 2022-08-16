import { Component, Input, QueryList, ViewChildren, AfterViewInit, AfterContentChecked, Directive, ContentChildren } from "@angular/core";
import { IColumnDefinition, TableColumnComponent } from "./table-column.directive";

@Component({
    selector: "t-grid",
    templateUrl: "./table-grid.component.html",
    styleUrls: ["./table-grid.component.css"],
})
export class TableGridComponent<T> implements AfterViewInit, AfterContentChecked {
    @Input()
    public data: T[] = [];

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
                sortable: view.sortable,
            }))
        }, 0);
    }

}
