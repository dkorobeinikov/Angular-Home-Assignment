import { Injectable } from "@angular/core";
import { Observable, skip, take, map } from "rxjs";
import { sortBy, SortDirection } from "../helpers/data-helper";
import { CsvLoaderService } from "./csv-loader.service";

export interface ICubeSolveResult {
    no: number;
    time: number;
    comment: string;
    scramble: string;
    date?: Date;
}

export interface IGetSolvesOptions {
    count?: number;
    startFrom?: number;
    sortByProperty?: keyof ICubeSolveResult;
    sortByDirection?: SortDirection;
}
@Injectable()
export class CubeSolvesResultsService {

    public constructor(
        private csvLoaderService: CsvLoaderService,
    ) {}

    public getTotalCount(): Observable<number> {

        return new Observable<number>((subscriber) => {
            this._get().then(solves => subscriber.next(solves.length))
                .then(() => subscriber.complete())
        });

    }

    public getSolves(options: IGetSolvesOptions): Observable<ICubeSolveResult[]> {

        console.log("options: ", options);

        let observable = new Observable<ICubeSolveResult[]>((subscriber) => {

            this._get()
                .then((solves) => subscriber.next(solves))
                .then(() => subscriber.complete());

        }).pipe(
            map(solves => {
                return options.sortByProperty
                    ? sortBy(solves, options.sortByProperty, options.sortByDirection ?? "asc")
                    : solves;
            }),
            map((solves) => {
                if ((options.count ?? 0) > 0) {
                    return solves.slice(
                        options.startFrom,
                        (options.startFrom ?? 0) + (options.count ?? 0));
                }

                return solves;
            })
        );

        return observable;

    }

    private async _get(): Promise<ICubeSolveResult[]> {

        const {
            columns,
            records,
        } = await this.csvLoaderService.loadCSV("/assets/data.csv")

        const {
            noIndex,
            timeIndex,
            commentIndex,
            scrambleIndex,
            dateIndex,
        } = this._getIndexes(columns);

        return records
            .filter(record => !record[timeIndex].startsWith("DNF"))
            .map(record => ({
                no: parseInt(record[noIndex]),
                comment: record[commentIndex] ?? "",
                date: new Date(record[dateIndex]) ?? null,
                scramble: record[scrambleIndex] ?? "",
                time: parseFloat(record[timeIndex]) ?? Infinity,
            }));

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
