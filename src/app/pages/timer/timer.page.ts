import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
    ],
    templateUrl: "./timer.page.html",
    styleUrls: [
        "./timer.page.css",
    ],
})
export class TimerPage {

}
