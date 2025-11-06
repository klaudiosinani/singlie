import {List} from './list';
import {Node} from './node';
import Linear from './linear';
import {CircularSinglyLinkedList, Consumer, Mapper, Predicate} from './interfaces';

/**
 * Circular linked list implementation
 * @template T - The type of values stored in the list
 */
export class Circular<T> extends List<T> implements CircularSinglyLinkedList<T> {
    protected _linkNewHead(node: Node<T>): void {
        this._last!.next = node;
    }

    protected _linkNewLast(node: Node<T>): void {
        node.next = this._head;
    }

    protected _linkFirstNode(node: Node<T>): void {
        node.next = node;
    }

    protected _updateHeadLinks(): void {
        this._last!.next = this._head;
    }

    protected _updateLastLinks(prev: Node<T>): void {
        prev.next = this._head;
    }

    protected _shouldClearOnHeadRemoval(next: Node<T> | null): boolean {
        return next === this._head;
    }

    public filter(predicate: Predicate<T>): Circular<T> {
        const list: Circular<T> = new Circular<T>();

        this.forEach((node: T) => {
            if (predicate(node)) {
                list.append(node);
            }
        });

        return list;
    }

    public forEach(consumer: Consumer<T>): this {
        let node: Node<T> | null = this._head;

        if (node) {
            do {
                consumer(node!.value);
                node = node!.next;
            } while (node !== this._head);
        }

        return this;
    }

    public includes(value: T): boolean {
        let node: Node<T> | null = this._head;

        if (node) {
            do {
                if (node!.value === value) {
                    return true;
                }
                node = node!.next;
            } while (node !== this._head);
        }

        return false;
    }

    public indexOf(value: T): number {
        let counter: number = 0;
        let node: Node<T> | null = this._head;

        if (node) {
            do {
                if (node!.value === value) {
                    return counter;
                }
                counter++;
                node = node!.next;
            } while (node !== this._head);
        }

        return -1;
    }

    public join(separator: string = ','): string {
        let result: string = '';
        let node: Node<T> | null = this._head;

        if (node) {
            do {
                result += String(node!.value);

                if (node!.next !== this._head) {
                    result += separator;
                }

                node = node!.next;
            } while (node !== this._head);
        }

        return result;
    }

    public map<U>(mapper: Mapper<T, U>): Circular<U> {
        const list: Circular<U> = new Circular<U>();
        this.forEach((node: T) => list.append(mapper(node)));
        return list;
    }

    public reverse(): Circular<T> {
        const list: Circular<T> = new Circular<T>();
        this.forEach((node: T) => list.prepend(node));
        return list;
    }

    public toLinear(): Linear<T> {
        const list: Linear<T> = new Linear<T>();
        this.forEach((node: T) => list.append(node));
        return list;
    }
}

export default Circular;
