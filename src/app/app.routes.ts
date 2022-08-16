import { Route } from "@angular/router";
import { AppComponent } from "./app.component";
import { TableGridPage } from "./pages/table-grid.page";

export const appRoutes: Route[] = [
    {
        path: "table-grid",
        component: TableGridPage,
    },
];
