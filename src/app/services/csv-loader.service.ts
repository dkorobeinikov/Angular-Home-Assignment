import { Injectable } from "@angular/core";

export interface ICsv {
    columns: string[];
    records: string[][];
}

@Injectable()
export class CsvLoaderService {

    public async loadCSV(
        url: string,
    ): Promise<ICsv> {

        const data = await fetch(url);

        const [header, ...records] = (await data.text()).split("\n");

        return {
            columns: header.split(","),
            records: records.filter(record => !!record).map(record => record.split(",")),
        };

    }

    private async *_read(reader: ReadableStreamDefaultReader) {
        return reader.read();
    }

}
