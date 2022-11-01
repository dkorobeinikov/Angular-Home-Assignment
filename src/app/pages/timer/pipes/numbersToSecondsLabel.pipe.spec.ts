import { NumberToSecondsPipe } from "./numberToSecondsLabel.pipe";

function format(seconds: number, milliseconds: number) {

    return `${seconds}.<span class="ms">${milliseconds.toString().padStart(2, "0")}</span>`;

}

describe("Number To Seconds label", () => {

    let pipe: NumberToSecondsPipe;

    beforeEach(() => {
        pipe = new NumberToSecondsPipe();
    });

    it("Returns 0.00 if non a parsable value passed", () => {

        expect(pipe.transform("hello")).toEqual(format(0, 0));

    });

    [
        { number: 2000, seconds: 2, milliseconds: 0 },
        { number: 22000, seconds: 22, milliseconds: 0 },
        { number: 22222, seconds: 22, milliseconds: 22 },
    ].forEach(({ number, seconds, milliseconds }) => {

        it(`Returns ${seconds}.${milliseconds} for ${number} input`, () => {

            expect(pipe.transform(number)).toEqual(format(seconds, milliseconds));

        });

    });

});
