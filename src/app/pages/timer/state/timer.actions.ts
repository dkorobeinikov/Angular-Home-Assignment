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
