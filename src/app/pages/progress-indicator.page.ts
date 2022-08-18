import { Component, OnInit } from "@angular/core";
import { Direction, ISortChangeEventArgs } from "../components/table/table-grid/table-grid.component";
import { sortBy } from "../helpers/data-helper";
import { CubeSolvesResultsService, ICubeSolveResult } from "../services/cube-solves-results.service";

@Component({
    templateUrl: "./progress-indicator.page.html",
    styleUrls: ["./progress-indicator.component.css"]
})
export class ProgressIndicatorPage {

    public progress = 70;
    public radius = 32;
    public time = 1000;

    private _endTime = 0;
    private _startTime = 0;
    private _animationFrame: number | null = null;

    public get showStopButton() {
        return !!this._animationFrame;
    }

    public constructor(
    ) {

    }

    public startProgress(event: SubmitEvent): void {
        event.preventDefault();

        this._startTime = Date.now();
        this._endTime = this._startTime + this.time;
        this.start();
    }

    public start() {
        this._animationFrame = requestAnimationFrame(() => {
            const now = Date.now();
            const time = this._endTime - this._startTime;

            const newProgress =  Math.abs((now - this._startTime) / time * 100);
            if (newProgress !== this.progress) {
                this.progress = newProgress;
            }

            if (now < this._endTime) {
                this.start();
            }
            else {
                this.stop();
            }
        });
    }

    public stop() {
        if (this._animationFrame) {
            cancelAnimationFrame(this._animationFrame);
            this._animationFrame = null;
        }
    }

    public handleStop(event: MouseEvent) {
        event.preventDefault();
        this.stop();
    }

    public onComplete() {
        this.stop();
    }
}
