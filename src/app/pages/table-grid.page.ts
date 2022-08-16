import { Component, OnInit } from "@angular/core";
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

}
