import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { CardComponent } from './components/card/card.component';
import { NavBarComponent } from './components/nav-bar.component';
import { ProgressIndicatorComponent } from './components/progress-indicator/progress-indicator.component';
import { IsNaNPipe } from './components/shared/isNan.pipe';
import { IsNotNaNPipe } from './components/shared/isNotNan.pipe';
import { TableColumnComponent } from './components/table/table-grid/table-column.directive';
import { TableGridComponent } from './components/table/table-grid/table-grid.component';
import { TablePaginator } from './components/table/table-paginator/table-paginator.component';
import { TableViewComponent } from './components/table/table-view/table-view.component';
import { HomePage } from './pages/home';
import { ProgressIndicatorPage } from './pages/progress-indicator';
import { TableGridPage } from './pages/table-grid';
import { CsvLoaderService } from './services/csv-loader.service';
import { CubeSolvesResultsService } from './services/cube-solves-results.service';
import { StoreModule } from '@ngrx/store';

@NgModule({
    declarations: [
        IsNaNPipe,
        IsNotNaNPipe,
        NavBarComponent,
        TableViewComponent,
        TableColumnComponent,
        TablePaginator,
        TableGridComponent,
        ProgressIndicatorComponent,
        CardComponent,
        HomePage,
        TableGridPage,
        ProgressIndicatorPage,
        AppComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(appRoutes),
        StoreModule.forRoot({}, {}),
    ],
    providers: [
        CsvLoaderService,
        CubeSolvesResultsService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
