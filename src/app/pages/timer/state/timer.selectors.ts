import { createFeatureSelector, createSelector } from "@ngrx/store";
import type { ITimerState } from "./timer.reducer";

const getSolvesFeatureState = createFeatureSelector<ITimerState>("solves");

export const getSolves = createSelector(
    getSolvesFeatureState,
    (state) => state.solves,
)

