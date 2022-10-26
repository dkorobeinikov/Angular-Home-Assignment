import { Route } from "@angular/router";
import { AppComponent } from "./app.component";
import { HomePage } from "./pages/home";
import { ProgressIndicatorPage } from "./pages/progress-indicator";
import { TableGridPage } from "./pages/table-grid";

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
    },
];
