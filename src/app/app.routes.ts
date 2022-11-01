import { Route } from "@angular/router";

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HomePage } from "./pages/home";
import { ProgressIndicatorPage } from "./pages/progress-indicator";
import { TableGridPage } from "./pages/table-grid";
import { importProvidersFrom } from "@angular/core";
import { solvesReducer } from "./pages/timer/state/timer.reducer";
import { TimerEffects } from "./pages/timer/state";
import { SolvesService } from "./pages/timer/services/solves.service";


export const appRoutes: Route[] = [
    {
        path: "",
        component: HomePage,
    },
    {
        path: "table-grid",
        component: TableGridPage,
    },
    {
        path: "progress-indicator",
        component: ProgressIndicatorPage,
    },
    {
        path: "autocomplete",
        loadComponent: () => import("./pages/autocomplete").then(({ AutocompletePage }) => AutocompletePage),
    },
    {
        path: "timer",
        loadComponent: () => import("./pages/timer").then(({ TimerPage }) => TimerPage),
        providers: [
            SolvesService,
            importProvidersFrom(
                StoreModule.forFeature("solves", solvesReducer),
                EffectsModule.forFeature([TimerEffects]),
            ),
        ],
    },
];
