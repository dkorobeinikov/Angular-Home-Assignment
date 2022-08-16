import { Component, OnInit } from "@angular/core";
import { CubeSolvesResultsService, ICubeSolveResult } from "../services/cube-solves-results.service";

@Component({
    templateUrl: "./table-grid.page.html"
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
