import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";;

import { SolvesService } from "../services/solves.service";

import * as TimerActions from "./timer.actions";

@Injectable()
export class TimerEffects {

    constructor(
        private actions$: Actions,
        private solvesService: SolvesService,
    ) { }

    public loadSolves$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TimerActions.loadSolves),
            mergeMap(() => {
                return this.solvesService.loadSolves().pipe(
                    map((solves) => TimerActions.loadSolvesSuccess({ solves })),
                    catchError((error) => {
                        this.handleError(error);
                        return of(TimerActions.loadSolvesFailed({ error: error }));
                    }),
                )
            }),
        );
    });

    public addSolve$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TimerActions.addSolve),
            mergeMap((solve: TimerActions.IAddSolvePayload) => {
                return this.solvesService.addSolve({
                    no: 0,
                    comment: "",
                    scramble: solve.scramble,
                    time: solve.time,
                    date: solve.date || new Date(),
                    dnf: solve.dnf,
                    plusTow: false,
                }).pipe(
                    map((solve) => TimerActions.addSolveSuccess({ solve })),
                    catchError((error) => {
                        this.handleError(error);
                        return of(TimerActions.addSolveFailed({ error: error }));
                    }),
                )
            }),
        );
    });

    private handleError(error: any) {
        console.error(error);
    }

}
