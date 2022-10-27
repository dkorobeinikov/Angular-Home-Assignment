import { CommonModule, DOCUMENT } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, ViewChild, Inject, OnInit, HostListener } from "@angular/core";
import { BehaviorSubject, delay, filter, from, fromEvent, map, Observable, Subscriber, tap, withLatestFrom } from "rxjs";
import * as Pipes from "./pipes";
import { TimerService } from "./services/timer.service";

type TimerState = "None" | "Initializing" | "ReadyToStart" | "Running" | "Stopped";

function canBeStarted(state: TimerState) {
    return (["None", "Stopped"] as TimerState[]).includes(state);
}

function canBeStoped(state: TimerState) {
    return (["Running"] as TimerState[]).includes(state);
}

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
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
export class TimerPage {
    @ViewChild("timeLabel")
    public timeLabel!: ElementRef<HTMLElement>;

    public timerState$ = new BehaviorSubject<TimerState>("None");
    public get timerState() {
        return this.timerState$.value;
    }

    public time$ = this.timer.time$;
    private _timeout: number | null = null;

    public constructor(
        @Inject(DOCUMENT)
        private _document: Document,
        private timer: TimerService,
    ) {

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
                    this.timerState$.next("ReadyToStart");
                }
            }, 500);

            return;
        }

        if (canBeStoped(this.timerState)) {
            this.timer.stop();
            this.timerState$.next("Stopped");
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

}

function isSpace(event: Event) {
    return event instanceof KeyboardEvent && event.code === "Space";
}

function isRepeated(event: Event) {
    return event instanceof KeyboardEvent && !!event.repeat;
}
