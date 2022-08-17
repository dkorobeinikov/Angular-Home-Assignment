import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Direction, ISortChangeEventArgs } from "../components/table/table-grid/table-grid.component";
import { sortBy } from "../helpers/data-helper";
import { CubeSolvesResultsObservableService } from "../services/cube-solves-results-observable.service";
import { CubeSolvesResultsService, ICubeSolveResult } from "../services/cube-solves-results.service";

@Component({
    templateUrl: "./table-grid.page.html",
    styles: [
        `
            .grid {
                border-radius: 3px;
                width: 700px;
                height: 500px;
            }
        `,
    ]
})
export class TableGridPage implements OnInit {

    public solves!: Observable<ICubeSolveResult[]>;

    public constructor(
        private solvesResultsService: CubeSolvesResultsObservableService,
    ) {

    }

    public ngOnInit(): void {
        this.solves = this.solvesResultsService.getSolves();
    }

    // public onSortChange(args: ISortChangeEventArgs<ICubeSolveResult>): void {
    //     this.solves = sortBy(this.solves, args.columnName, args.direction === Direction.Ascending ? "asc" : "desc");
    // }
}
