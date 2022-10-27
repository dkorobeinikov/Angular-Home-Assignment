import { CommonModule, DOCUMENT } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, ViewChild, Inject, OnInit, HostListener } from "@angular/core";
import { BehaviorSubject, delay, filter, from, fromEvent, map, Observable, Subscriber, tap, withLatestFrom } from "rxjs";
import { Store } from '@ngrx/store';
import { TableGridComponent } from "src/app/components/table/table-grid/table-grid.component";
import { TableViewComponent } from "src/app/components/table/table-view/table-view.component";
import * as Pipes from "./pipes";
import { TimerService } from "./services/timer.service";

import { ITimerState, SolvesActions, SolvesSelectors } from "./state";
import { IColumnDefinition } from "src/app/components/table/table-grid/table-column.directive";
import { ISolve } from "./types";

type TimerState = "None" | "Initializing" | "ReadyToStart" | "Running" | "Stopped";

function canBeStarted(state: TimerState) {
    return (["None", "Stopped"] as TimerState[]).includes(state);
}

function canBeStoped(state: TimerState) {
    return (["Running"] as TimerState[]).includes(state);
}

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [
        CommonModule,
        TableViewComponent,
        Pipes.NumberToSecondsPipe,
    ],
    providers: [
        TimerService,
    ],
    templateUrl: "./timer.page.html",
    styleUrls: [
        "./timer.page.css",
    ],
})
export class TimerPage implements OnInit {
    @ViewChild("timeLabel")
    public timeLabel!: ElementRef<HTMLElement>;

    public timerState$ = new BehaviorSubject<TimerState>("None");
    public get timerState() {
        return this.timerState$.value;
    }

    public showMainView$ = this.timerState$.pipe(
        map(state => !(["ReadyToStart", "Running"] as TimerState[]).includes(state) ),
    );

    public time$ = this.timer.time$;
    private _timeout: number | null = null;

    public solves$!: Observable<ISolve[]>;
    public solvesTableColumns: IColumnDefinition<ISolve>[] = [
        {
            name: "",
            property: "no",
            sortBy: "none",
        },
        {
            name: "Current",
            property: "time",
            sortBy: "none",
        },
    ];


    public constructor(
        private store: Store<ITimerState>,
        private timer: TimerService,
    ) {

    }

    public ngOnInit(): void {
        this.solves$ = this.store.select(SolvesSelectors.getSolves);
    }

    @HostListener("document:keydown.space", ["$event"])
    private _onSpaceKeydown($event: Event) {
        if (!isSpace($event) || isRepeated($event)) {
            return;
        }

        if (canBeStarted(this.timerState)) {
            this.timerState$.next("Initializing");
            this._timeout = window.setTimeout(() => {
                if (this.timerState === "Initializing") {
                    this.timer.resetTime();
                    this.timerState$.next("ReadyToStart");
                }
            }, 500);

            return;
        }

        if (canBeStoped(this.timerState)) {
            const time = this.timer.stop();
            this.timerState$.next("Stopped");

            this.addSolve(time, "");
            return;
        }
    }

    @HostListener("document:keyup.space", ["$event"])
    private _onSpaceKeyup($event: Event) {
        if (!isSpace($event)) {
            return;
        }

        if (this.timerState === "ReadyToStart") {
            this.timer.start();
            this.timerState$.next("Running");
            return;
        }

        if (this.timerState === "Initializing") {
            this.timerState$.next("None");

            if (this._timeout) {
                clearTimeout(this._timeout);
                this._timeout = null;
            }
            return;
        }
    }

    private addSolve(time: number, scramble: "", dnf = false) {
        this.store.dispatch(SolvesActions.addSolve({ time, scramble, dnf, date: new Date() }))
    }

}

function isSpace(event: Event) {
    return event instanceof KeyboardEvent && event.code === "Space";
}

function isRepeated(event: Event) {
    return event instanceof KeyboardEvent && !!event.repeat;
}
