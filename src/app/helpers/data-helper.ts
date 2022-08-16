export function getPage<T>(
    data: T[],
    pageSize: number,
    currentPage: number,
): T[] {

    let result: T[] = [];

    for (let i = 0; i < pageSize; i++) {
        const recordIndex = (currentPage - 1) * pageSize + i;
        const record = data[recordIndex];

        if (!record) {
            break;
        } else {
            result.push(record);
        }

    }

    return result;

}

export function sortBy<T>(
    data: T[],
    property: keyof T,
    direction: "asc" | "desc",
): T[] {

    const sorted = [...data];
    const multiplier = direction === "asc" ? 1 : -1;
    sorted.sort((a, b) => sorter(a[property], b[property]) * multiplier);

    return sorted;

}

export function sorter<T>(a: T, b: T): number {
    return a > b ? 1 : (a < b ? -1 : 0);
}
