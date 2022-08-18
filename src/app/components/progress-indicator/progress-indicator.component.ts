import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

@Component({
    selector: "t-progress",
    templateUrl: "progress-indicator.component.html",
    styles: [
        `
            .progress-indicator {
                border-radius: 50%;
                position: relative;
                clip-path: circle(50%);
            }

            .ratio::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                z-index: -2;
            }

            .progress-indicator::after {
                content: '';
                position: absolute;
                width: 80%;
                height: 80%;
                top: 10%;
                left: 10%;
                background-color: white;
                border-radius: 50%;
                z-index: -1;
            }
        `
    ],
})
export class ProgressIndicatorComponent implements OnChanges {
    @Input()
    public radius = 16;

    @Input()
    public progress = 0;

    @Input()
    public color = "green";

    @Output()
    public complete = new EventEmitter();

    public getStyles() {
        const angle = `${this.progress / 100 * 360 }`;
        return {
            "width": `${this.radius * 2}px`,
            "height": `${this.radius * 2}px`,
            "background-image": `conic-gradient(${this.color} 0 calc(${angle}deg),transparent  calc(${angle}deg) 360deg)`
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (
            changes["progress"] &&
            changes["progress"].previousValue !== changes["progress"].currentValue &&
            changes["progress"].previousValue < 100 &&
            changes["progress"].currentValue === 100
        ) {
            this.complete.emit();
        }
    }

}
