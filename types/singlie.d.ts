declare namespace node {
  export interface Constructor {
    new (options?: { value?: any }): Instance;
  }

  export interface Instance {
    value: any;
    next: Instance | null;
  }
}

declare namespace circular {
  export interface Constructor {
    new (): Instance;
  }

  export interface Instance {
    readonly head: any;
    readonly last: any;
    readonly length: number;
    append(...values: any): this;
    clear(): this;
    forEach(fn: (value: any) => any): void;
    get(index: number): any;
    insert(opts: { value: any | any[]; index: number }): this;
    isEmpty(): boolean;
    join(separator: string): string;
    map(fn: (value: any) => any): this;
    node(index: number): node.Instance;
    prepend(...values: any): this;
    remove(index: number): this;
    reverse(): this;
    set(opts: { value: any; index: number }): this;
    toArray(): any[];
  }
}

declare namespace linear {
  export interface Constructor {
    new (): Instance;
  }

  interface Instance extends circular.Instance {}
}

declare namespace singlie {
  export interface Node extends node.Instance {}
}

declare const singlie: {
  Circular: circular.Constructor;
  Linear: linear.Constructor;
  Node: node.Constructor;
};

export = singlie;
