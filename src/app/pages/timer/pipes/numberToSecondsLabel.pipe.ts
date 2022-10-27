import { Pipe } from "@angular/core";

@Pipe({
    name: "toSeconds",
    standalone: true,
})
export class NumberToSecondsPipe {
    transform(content: any) {
        let time = +content;
        if (isNaN(time)) {
            time = 0;
        }

        const seconds = Math.floor(time / 1000);
        const milliseconds = Math.floor((time % 1000) / 10);

        return `${seconds}.<span class="ms">${milliseconds.toString().padStart(2, "0")}</span>`;
    }
}
