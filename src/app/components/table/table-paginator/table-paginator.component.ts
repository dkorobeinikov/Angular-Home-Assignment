import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "t-paginator",
    templateUrl: "./table-paginator.component.html",
    styleUrls: [
        "./table-paginator.component.css"
    ],
})
export class TablePaginator {

    @Input()
    public pageSize: number | null = null;

    @Input()
    public total!: number;

    @Input()
    public currentPage: number = 1;

    @Output()
    public requestPage = new EventEmitter<number>();

    public get totalPages(): number {
        if (this.pageSize === null) {
            return 1;
        }

        return Math.ceil(this.total / this.pageSize);
    }

    public get hasNextPage(): boolean {
        return this.currentPage < this.totalPages;
    }

    public get hasPreviousPage(): boolean {
        return this.currentPage > 1;
    }

    public getPageRanges(): number[] {

        const firsts = [1, 2];
        const lasts = [this.totalPages - 1, this.totalPages];
        const medians = this.totalPages % 2 === 0
            ? [this.totalPages / 2, this.totalPages / 2 + 1]
            : [
                Math.ceil(this.totalPages / 2),
            ];
        const aroundCurrent = [this.currentPage -1, this.currentPage, this.currentPage + 1];

        const toShow = new Set([...firsts, ...lasts, ...medians, ...aroundCurrent]);

        const result = [];
        for (let i = 1; i <= this.totalPages; i++) {
            if (toShow.has(i)) {
                result.push(i);
            } else if (!isNaN(result[result.length - 1])) {
                result.push(NaN);
            }
        }

        return result;

    }

    public handleClickPrevious($event: MouseEvent) {
        if (!this.hasPreviousPage) {
            return;
        }
        this.requestPage.emit(this.currentPage - 1);
    }

    public handleClickNext($event: MouseEvent) {
        if (!this.hasNextPage) {
            return;
        }

        this.requestPage.emit(this.currentPage + 1);
    }

    public handleClickPage($event: MouseEvent, num: number) {
        let pageNumberToRequest = num;
        if (num > this.totalPages || num < 1) {
            pageNumberToRequest = 1;
        }

        this.requestPage.emit(pageNumberToRequest);
    }

}
