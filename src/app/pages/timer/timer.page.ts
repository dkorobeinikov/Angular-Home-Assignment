import { CommonModule, } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, OnInit, HostListener } from "@angular/core";
import { BehaviorSubject, map, Observable, } from "rxjs";
import { Store } from '@ngrx/store';
import { TableViewComponent } from "src/app/components/table/table-view/table-view.component";
import * as Pipes from "./pipes";
import { TimerService } from "./services/timer.service";

import { ITimerState, TimerActions, TimerSelectors } from "./state";
import { IColumnDefinition } from "src/app/components/table/table-grid/table-column.directive";
import { ISolve } from "./types";
import { SolvesService } from "./services/solves.service";
import { splitSecondsToMilliseconds } from "./utils/time";

type TimerState = "None" | "Initializing" | "ReadyToStart" | "Running" | "Stopped";

function canBeStarted(state: TimerState) {
    return (["None", "Stopped"] as TimerState[]).includes(state);
}

function canBeStoped(state: TimerState) {
    return (["Running"] as TimerState[]).includes(state);
}

interface ISolveDTO {
    no: number;
    displayTime: string;
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
        SolvesService,
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

    public solves$!: Observable<ISolveDTO[]>;
    public solvesTableColumns: IColumnDefinition<ISolveDTO>[] = [
        {
            name: "",
            property: "no",
            sortBy: "disabled",
        },
        {
            name: "Time",
            property: "displayTime",
            sortBy: "disabled",
        },
    ];


    public constructor(
        private store: Store<ITimerState>,
        private timer: TimerService,
    ) {

    }

    public ngOnInit(): void {
        this.store.dispatch(TimerActions.loadSolves());
        this.solves$ = this.store.select(TimerSelectors.getSolves).pipe(
            map((solves) => {
                return solves.map(solve => {
                    const { milliseconds, seconds } = splitSecondsToMilliseconds(solve.time, 2);
                    return {
                        no: solve.no,
                        displayTime: `${seconds}.${milliseconds}`,
                    } as ISolveDTO;
                }).reverse();
            })
        );
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
        this.store.dispatch(TimerActions.addSolve({ time, scramble, dnf, date: new Date() }))
    }

}

function isSpace(event: Event) {
    return event instanceof KeyboardEvent && event.code === "Space";
}

function isRepeated(event: Event) {
    return event instanceof KeyboardEvent && !!event.repeat;
}
