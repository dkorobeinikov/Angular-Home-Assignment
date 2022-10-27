import { Pipe } from "@angular/core";

@Pipe({
    name: "toSeconds",
    standalone: true,
})
export class NumberToSecondsPipe {
    transform(content: any, precision = 2) {
        let time = toNumber(content, 0);
        let divideMilisecondsTo = 10 ** (3 - clamp(precision, 1, 3));

        const seconds = Math.floor(time / 1000);
        const milliseconds = Math.floor((time % 1000) / divideMilisecondsTo);

        return `${seconds}.<span class="ms">${milliseconds.toString().padStart(precision, "0")}</span>`;
    }
}

function toNumber(value: string, defaultValue: number = 0) {

    const parsed = +value;
    if (isNaN(parsed)) {
        return defaultValue;
    }

    return parsed;

}

export function clamp(value: number, min: number = -Infinity, max: number = Infinity): number {
    return Math.min(Math.max(value, min), max);
}
