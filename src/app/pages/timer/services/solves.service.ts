import { Injectable } from "@angular/core";
import { delay, Observable } from "rxjs";
import { ISolve } from "../types";

@Injectable()
export class SolvesService {

    public loadSolves() {

        return new Observable<ISolve[]>((subscriber) => {
            subscriber.next(this._load());
            subscriber.complete();
        }).pipe(delay(200));

    }

    public addSolve(solve: ISolve) {

        return new Observable<ISolve>((subscriber) => {
            const solves = this._load();

            let latestNo = 0;
            for (let { no } of solves) {
                if (no > latestNo) {
                    latestNo = no;
                }
            }

            solve.no = latestNo + 1;
            solves.push(solve);

            localStorage.setItem("solves", JSON.stringify(solves));

            subscriber.next(solve);
            subscriber.complete();
        }).pipe(delay(200));

    }

    public deleteSolve(solve: ISolve) {

        return new Observable<ISolve>((subscriber) => {
            const solves = this._load();
            const index = solves.findIndex(s => s.no === solve.no);

            if (index > 0) {
                const newSolves = solves.splice(index, 1);
                localStorage.setItem("solves", JSON.stringify(newSolves));
            }

            subscriber.next(solve);
            subscriber.complete();
        }).pipe(delay(200));

    }

    public updateSolve(solve: ISolve) {

        return new Observable<ISolve>((subscriber) => {
            const solves = this._load();
            const index = solves.findIndex(s => s.no === solve.no);

            if (index > 0) {
                solves[index] = {
                    ...solves[index],
                    ...solve,
                };
                localStorage.setItem("solves", JSON.stringify(solves));
            }

            subscriber.next(solve);
            subscriber.complete();
        }).pipe(delay(200));

    }

    private _load(): ISolve[] {
        return JSON.parse(localStorage.getItem("solves") || "[]").map((solve: any) => {
            return {
                ...solve,
                date: new Date(solve.date),
            };
        });
    }

}
