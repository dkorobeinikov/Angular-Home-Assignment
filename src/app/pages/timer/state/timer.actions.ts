import { createAction, props } from '@ngrx/store';

import { ISolve } from "../types";

export interface IAddSolvePayload {
    time: number;
    scramble: string;
    date?: Date;
    dnf?: boolean;
}
export const addSolve = createAction(
    "[Timer] AddSolve",
    props<IAddSolvePayload>(),
);

export const addSolveSuccess = createAction(
    "[Timer] AddSolveSuccess",
    props<{ solve: ISolve }>(),
);

export const addSolveFailed = createAction(
    "[Timer] AddSolveFailed",
    props<{ error: string }>(),
);

export const loadSolves = createAction(
    "[Timer] LoadSolves",
);

export const loadSolvesSuccess = createAction(
    "[Timer] LoadSolvesSuccess",
    props<{ solves: ISolve[] }>(),
);

export const loadSolvesFailed = createAction(
    "[Timer] LoadSolvesFailed",
    props<{ error: string }>(),
);

export const deleteSolve = createAction(
    "[Timer] DeleteSolve",
    props<{ no: number }>(),
);

export const deleteSolveSuccess = createAction(
    "[Timer] DeleteSolveSuccess",
    props<{ solve: ISolve[] }>(),
);

export const deleteSolveFailed = createAction(
    "[Timer] DeleteSolveFailed",
    props<{ error: string }>(),
);

export const updateSolve = createAction(
    "[Timer] UpdateSolve",
    props<{ solve: ISolve }>(),
);

export const updateSolveSuccess = createAction(
    "[Timer] UpdateSolveSuccess",
    props<{ solve: ISolve[] }>(),
);

export const updateSolveFailed = createAction(
    "[Timer] UpdateSolveFailed",
    props<{ error: string }>(),
);
