declare namespace node {
  export interface Constructor {
    new <T = unknown>(value?: T): Instance<T>;
  }

  export interface Instance<T = unknown> {
    value: T;
    next: Instance<T> | null;
  }
}

declare namespace list {
  type Reducer<U, T> = (previousValue: U, currentValue: T) => U;

  export interface Instance<T> {
    readonly length: number;
    append(...values: T[]): this;
    clear(): this;
    filter(fn: (value: T) => boolean): this;
    forEach(fn: (value: T) => void): this;
    get(index: number): T;
    includes(value: T): boolean;
    indexOf(value: T): number;
    insert(opts: { value: T | T[]; index: number }): this;
    isCircular(): boolean;
    isEmpty(): boolean;
    isLinear(): boolean;
    join(separator?: string): string;
    node(index: number): node.Instance<T>;
    prepend(...values: T[]): this;
    reduce<U>(fn: Reducer<U, T>, initialValue: U): U;
    remove(index: number): this;
    reverse(): this;
    set(opts: { value: T; index: number }): this;
    toArray(): T[];
    toString(): string;
  }
}

declare namespace linear {
  interface LastNode<T> extends node.Instance<T> {
    next: null;
  }

  interface HeadNode<T> extends node.Instance<T> {
    prev: null;
  }

  export interface Constructor {
    new <T = unknown>(): Instance<T>;
  }

  interface Instance<T = unknown> extends list.Instance<T> {
    readonly head: HeadNode<T> | null;
    readonly last: LastNode<T> | null;
    map<U>(fn: (value: T) => U): Instance<U>;
    toCircular(): circular.Instance<T>;
  }
}

declare namespace circular {
  interface LastNode<T> extends node.Instance<T> {
    next: node.Instance<T>;
    prev: node.Instance<T>;
  }

  interface HeadNode<T> extends node.Instance<T> {
    next: node.Instance<T>;
    prev: node.Instance<T>;
  }

  export interface Constructor {
    new <T = unknown>(): Instance<T>;
  }

  interface Instance<T = unknown> extends list.Instance<T> {
    readonly head: HeadNode<T> | null;
    readonly last: LastNode<T> | null;
    map<U>(fn: (value: T) => U): Instance<U>;
    toLinear(): linear.Instance<T>;
  }
}

declare namespace singlie {
  export interface Circular<T = unknown> extends circular.Instance<T> {}
  export interface Linear<T = unknown> extends linear.Instance<T> {}
  export interface Node<T = unknown> extends node.Instance<T> {}
}

declare const singlie: {
  Circular: circular.Constructor;
  Linear: linear.Constructor;
  Node: node.Constructor;
};

export = singlie;
