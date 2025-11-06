/**
 * Search and lookup capabilities
 */
export interface Queryable<T> {
    includes(value: T): boolean;

    indexOf(value: T): number;
}
