import {Consumer, Mapper, Predicate, Reducer} from '../functions';

/**
 * Iteration and transformation capabilities
 */
export interface Iterable<T> {
    forEach(consumer: Consumer<T>): Iterable<T>;

    filter(predicate: Predicate<T>): Iterable<T>;

    map<U>(mapper: Mapper<T, U>): Iterable<U>;

    reduce<U>(reducer: Reducer<T, U>, initialValue: U): U;

    reverse(): Iterable<T>;
}
