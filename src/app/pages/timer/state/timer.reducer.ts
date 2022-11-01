import { createReducer, on } from '@ngrx/store';

import { ISolve } from '../types';
import * as TimerActions from "./timer.actions";


export interface ITimerState {
    currentScramble: string | null;
    prevScramble: string | null;
    solves: ISolve[];
}

const initialState: ITimerState = {
    currentScramble: null,
    prevScramble: null,
    solves: [],
};

export const solvesReducer = createReducer<ITimerState>(
    initialState,
    on(TimerActions.addSolveSuccess, (state, action) => {
        return {
            ...state,
            solves: [
                ...state.solves,
                action.solve,
            ],
        };
    }),
    on(TimerActions.loadSolvesSuccess, (state, action) => {
        return {
            ...state,
            solves: [...action.solves],
        };
    }),
);
