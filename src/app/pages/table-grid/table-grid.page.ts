import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Direction, IPaginationChangeEventArgs, ISortChangeEventArgs } from "../../components/table/table-grid/table-grid.component";
import { sortBy, SortDirection } from "../../helpers/data-helper";
import { CubeSolvesResultsService, ICubeSolveResult } from "../../services/cube-solves-results.service";

@Component({
    templateUrl: "./table-grid.page.html",
    styles: [
        `
            .container {
                padding: 3rem;
                text-align: center
            }

            .grid {
                margin: 4rem auto;
                border-radius: 3px;
                width: 700px;
                height: 500px;
            }
        `,
    ]
})
export class TableGridPage implements OnInit {

    // public
    public solves!: Observable<ICubeSolveResult[]>;
    public total: number = 0;
    public pageSize: number | null = 50;

    private sortByProperty: keyof ICubeSolveResult | undefined = undefined;
    private sortByDirection: SortDirection | undefined = undefined;
    private pageNumber: number = 1;

    public constructor(
        private solvesResultsService: CubeSolvesResultsService,
    ) {

    }

    public ngOnInit(): void {
        this._update();
    }

    public onSortChange(args: ISortChangeEventArgs<ICubeSolveResult>): void {
        this.sortByProperty = args.columnName;
        this.sortByDirection = args.direction === Direction.Ascending ? "asc" : "desc";

        this._update();
    }

    public onPaginationChange(args: IPaginationChangeEventArgs) {
        this.pageNumber = args.currentPage;
        this.pageSize = args.pageSize;
        this._update();
    }

    private _update() {

        this.solves = this.solvesResultsService.getSolves({
            count: this.pageSize ?? undefined,
            startFrom: this.pageSize ? this.pageSize * (this.pageNumber - 1) : 0,
            sortByDirection: this.sortByDirection,
            sortByProperty: this.sortByProperty,
        });

        this.solvesResultsService.getTotalCount().subscribe((total) => {
            this.total = total
        });

    }
}
