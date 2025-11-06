/**
 * Conversion capabilities
 */
export interface Serializable<T> {
    toArray(): T[];

    toString(): string;

    join(separator?: string): string;
}
