import { Pipe } from "@angular/core";
import { splitSecondsToMilliseconds } from "../utils/time";

@Pipe({
    name: "toSeconds",
    standalone: true,
})
export class NumberToSecondsPipe {
    transform(content: any, precision = 2) {
        const { seconds, milliseconds } = splitSecondsToMilliseconds(content, precision);

        return `${seconds}.<span class="ms">${milliseconds.toString().padStart(precision, "0")}</span>`;
    }
}

