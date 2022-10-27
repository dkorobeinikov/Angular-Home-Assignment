import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subscriber } from "rxjs";

@Injectable()
export class TimerService {

    private timeSubject = new BehaviorSubject<number>(0);
    public time$ = this.timeSubject.asObservable();

    private _timer: Timer | null = null;

    public start() {
        this._timer = new Timer();
        this._timer.start().subscribe({
            next: (value) => this.timeSubject.next(value),
        });
    }

    public stop() {
        const timeResult = this._timer?.stop();
        this.timeSubject.next(timeResult ?? 0);
        this._timer = null;

        return timeResult || 0;
    }

}

class Timer {

    private _startTime: number | null = null;

    private _subscriber: Subscriber<number> | null = null;
    private _rafNumber = 0;

    public constructor() {

    }

    public start() {

        return new Observable<number>((subscriber) => {
            console.log("create subsriber");
            this._subscriber = subscriber;
            this._subscriber.next(0);
            this._startTime = Date.now();
            this._onNextTick();
        });

    }

    public stop(): number {
        this._subscriber?.complete();
        this._subscriber?.unsubscribe();
        cancelAnimationFrame(this._rafNumber);

        return Date.now() - (this._startTime ?? 0);
    }

    private _onNextTick() {
        console.log("_onNextTick");

        this._subscriber?.next(Date.now() - (this._startTime ?? 0));
        this._rafNumber = requestAnimationFrame(() => this._onNextTick());

    }

}
