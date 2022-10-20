export function getPage<T>(
    data: T[],
    pageSize: number,
    currentPage: number,
): T[] {

    if (!pageSize || pageSize < 0) {
        return [...data];
    }

    const startFrom = (currentPage - 1) * pageSize;
    const endIndex = (startFrom ?? 0) + pageSize;

    return data.splice(
        startFrom,
        endIndex
    );

}

export type SortDirection = "asc" | "desc";

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
