import { createReducer, on } from '@ngrx/store';

import { ISolve } from '../types';
import * as TimerActions from "./timer.actions";


export interface ITimerState {
    currentScramble: string | null;
    prevScramble: string | null;
    solves: ISolve[];
}

const initialStatre: ITimerState = {
    currentScramble: null,
    prevScramble: null,
    solves: [],
};

export const solvesReducer = createReducer<ITimerState>(
    initialStatre,
    on(TimerActions.addSolve, (state, action) => {

        let latestNo = 0;
        for (let solve of state.solves) {
            if (solve.no > latestNo) {
                latestNo = solve.no;
            }
        }

        let date = action.date ?? new Date();

        return {
            ...state,
            sovles: [
                ...state.solves,
                {
                    no: latestNo + 1,
                    scramble: action.scramble,
                    dnf: !!action.dnf,
                    time: action.time,
                    date,
                    comment: "",
                } as ISolve,
            ],
        };
    }),
);
