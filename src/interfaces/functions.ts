export type Consumer<T> = (value: T) => void;

export type Predicate<T> = (value: T) => boolean;

export type Mapper<T, U> = (value: T) => U;

export type Reducer<T, U> = (accumulator: U, value: T) => U;
