import { Component, OnInit } from "@angular/core";
import { Direction, ISortChangeEventArgs } from "../components/table/table-grid/table-grid.component";
import { CubeSolvesResultsService, ICubeSolveResult } from "../services/cube-solves-results.service";

@Component({
    templateUrl: "./table-grid.page.html",
    styles: [
        `
            .grid {
                border-radius: 3px;
                overflow: auto;
                width: 700px;
                height: 500px;
            }
        `,
    ]
})
export class TableGridPage implements OnInit {

    public solves: ICubeSolveResult[] = [];

    public constructor(
        private solvesResultsService: CubeSolvesResultsService,
    ) {

    }

    public ngOnInit(): void {
        this.solvesResultsService.getSolves().then((solves) => this.solves = solves);
    }

    public onSortChange(args: ISortChangeEventArgs<ICubeSolveResult>): void {
        this.solves.sort((solve1, solve2) =>
            this._sorter(solve1[args.columnName], solve2[args.columnName]) * (args.direction === Direction.Ascending ? 1 : -1)
        );
    }

    private _sorter<T>(a: T, b: T): number {
        return a > b ? 1 : (a < b ? -1 : 0);
    }

}
