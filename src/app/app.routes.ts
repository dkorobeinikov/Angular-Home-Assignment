import { Route } from "@angular/router";
import { AppComponent } from "./app.component";
import { HomePage } from "./pages/home.page";
import { ProgressIndicatorPage } from "./pages/progress-indicator.page";
import { TableGridPage } from "./pages/table-grid.page";

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
];
