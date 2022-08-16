import { Injectable } from "@angular/core";
import { CsvLoaderService } from "./csv-loader.service";

export interface ICubeSolveResult {
    no: string;
    time: number;
    comment: string;
    scramble: string;
    date?: Date;
}

@Injectable()
export class CubeSolvesResultsService {

    public constructor(
        private csvLoaderService: CsvLoaderService,
    ) {}

    public async getSolves(): Promise<ICubeSolveResult[]> {
        const {
            columns,
            records,
        } = await this.csvLoaderService.loadCSV("/assets/data.csv");

        const solves: ICubeSolveResult[] = [];


        const {
            noIndex,
            timeIndex,
            commentIndex,
            scrambleIndex,
            dateIndex,
        } = this._getIndexes(columns);


        for (const record of records) {
            solves.push({
                no: record[noIndex],
                comment: record[commentIndex] ?? "",
                date: new Date(record[dateIndex]) ?? null,
                scramble: record[scrambleIndex] ?? "",
                time: parseFloat(record[timeIndex]) ?? Infinity,
            });
        }

        return solves;
    }

    private _getIndexes(
        columns: string[]
    ): {
        noIndex: number,
        timeIndex: number,
        commentIndex: number,
        scrambleIndex: number,
        dateIndex: number,
    } {

        let noIndex = -1;
        let timeIndex = -1;
        let commentIndex = -1;
        let scrambleIndex = -1;
        let dateIndex = -1;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i] === "No.") noIndex = i;
            if (columns[i] === "Time") timeIndex = i;
            if (columns[i] === "Scramble") scrambleIndex = i;
            if (columns[i] === "Comment") commentIndex = i;
            if (columns[i] === "Date") dateIndex = i;
        }

        return {
            noIndex,
            timeIndex,
            commentIndex,
            scrambleIndex,
            dateIndex,
        };

    }

}
