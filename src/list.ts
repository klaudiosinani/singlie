import {Node} from './node';
import {Consumer, Iterable, Mapper, Predicate, Queryable, Reducer, Serializable, SinglyLinkedList} from './interfaces';

export abstract class List<T> implements SinglyLinkedList<T>, Iterable<T>, Queryable<T>, Serializable<T> {
    protected _head: Node<T> | null = null;
    protected _last: Node<T> | null = null;
    protected _length: number = 0;

    get head(): Node<T> | null {
        return this._head;
    }

    get last(): Node<T> | null {
        return this._last;
    }

    get length(): number {
        return this._length;
    }

    protected _normalizeToArray(value: T | T[]): T[] {
        return Array.isArray(value) ? value : [value];
    }

    protected _isIndexInBounds(index: number): boolean {
        return index >= 0 && index < this.length;
    }

    protected _validateIndex(index: number): void {
        if (!this._isIndexInBounds(index)) {
            throw new RangeError('List index out of bounds');
        }
    }

    protected abstract _linkNewHead(node: Node<T>): void;

    protected abstract _linkNewLast(node: Node<T>): void;

    protected abstract _linkFirstNode(node: Node<T>): void;

    protected abstract _updateHeadLinks(): void;

    protected abstract _updateLastLinks(prev: Node<T>): void;

    protected abstract _shouldClearOnHeadRemoval(next: Node<T> | null): boolean;

    private _addHead(value: T): void {
        const node: Node<T> = new Node(value);
        node.next = this._head;
        this._head = node;
        this._linkNewHead(node);
        this._length++;
    }

    private _addLast(value: T): void {
        const node: Node<T> = new Node(value);
        this._last!.next = node;
        this._last = node;
        this._linkNewLast(node);
        this._length++;
    }

    private _addNode(value: T, index: number): void {
        const node: Node<T> = new Node(value);
        const prev: Node<T> = this.node(index - 1);
        node.next = prev.next;
        prev.next = node;
        this._length++;
    }

    private _initializeList(value: T): void {
        const node: Node<T> = new Node(value);
        this._head = node;
        this._last = node;
        this._linkFirstNode(node);
        this._length++;
    }

    private _removeHead(): this {
        const next: Node<T> | null = this._head!.next;

        if (this._shouldClearOnHeadRemoval(next)) {
            return this.clear();
        }

        this._head = next;
        this._updateHeadLinks();
        this._length--;
        return this;
    }

    private _removeLast(): this {
        const prev: Node<T> = this.node(this.length - 2);
        this._last = prev;
        this._updateLastLinks(prev);
        this._length--;
        return this;
    }

    private _removeNode(index: number): this {
        const prev: Node<T> = this.node(index - 1);
        const node: Node<T> = prev.next!;
        prev.next = node.next;
        this._length--;
        return this;
    }

    public clear(): this {
        this._head = null;
        this._last = null;
        this._length = 0;
        return this;
    }

    public get(index: number): T {
        return this.node(index).value;
    }

    public isEmpty(): boolean {
        return !this._head && this._length === 0;
    }

    public node(index: number): Node<T> {
        this._validateIndex(index);
        let count: number = 0;
        let node: Node<T> = this._head!;

        while (index !== count) {
            node = node.next!;
            count++;
        }

        return node;
    }

    public set(options: { value: T; index: number }): this {
        const {value, index} = options;
        this.node(index).value = value;
        return this;
    }

    public append(...values: T[]): this {
        values.forEach((value: T) => {
            if (this.isEmpty()) {
                this._initializeList(value);
            } else {
                this._addLast(value);
            }
        });
        return this;
    }

    public prepend(...values: T[]): this {
        values.forEach((value: T) => {
            if (this.isEmpty()) {
                this._initializeList(value);
            } else {
                this._addHead(value);
            }
        });
        return this;
    }

    public insert(options: { value: T | T[]; index: number }): this {
        const {value, index} = options;

        this._normalizeToArray(value)
            .forEach((node: T) => {
                if (index === 0) {
                    this.prepend(node);
                } else if (index === this.length) {
                    this.append(node);
                } else {
                    this._addNode(node, index);
                }
            });

        return this;
    }

    public remove(index: number): this {
        if (!this._isIndexInBounds(index)) {
            throw new RangeError('List index out of bounds');
        }

        if (index === 0) {
            return this._removeHead();
        }

        if (index === this.length - 1) {
            return this._removeLast();
        }

        return this._removeNode(index);
    }

    public reduce<U>(reducer: Reducer<T, U>, initialValue: U): U {
        let result: U = initialValue;
        this.forEach((node: T) => {
            result = reducer(result, node);
        });
        return result;
    }

    public toArray(): T[] {
        const array: T[] = [];
        this.forEach((node: T) => array.push(node));
        return array;
    }

    public toString(): string {
        return this.join(',');
    }

    public abstract forEach(consumer: Consumer<T>): List<T>;

    public abstract includes(value: T): boolean;

    public abstract indexOf(value: T): number;

    public abstract join(separator?: string): string;

    public abstract filter(predicate: Predicate<T>): List<T>;

    public abstract map<U>(mapper: Mapper<T, U>): List<U>;

    public abstract reverse(): List<T>;
}
