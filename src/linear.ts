import {List} from './list';
import {Node} from './node';
import Circular from './circular';
import {Consumer, LinearSinglyLinkedList, Mapper, Predicate} from './interfaces';

/**
 * Linear linked list implementation
 * @template T - The type of values stored in the list
 */
export class Linear<T> extends List<T> implements LinearSinglyLinkedList<T> {
    protected _linkNewHead(node: Node<T>): void {
        return;
    }

    protected _linkNewLast(node: Node<T>): void {
        return;
    }

    protected _linkFirstNode(node: Node<T>): void {
        return;
    }

    protected _updateHeadLinks(): void {
        return;
    }

    protected _updateLastLinks(prev: Node<T>): void {
        prev.next = null;
    }

    protected _shouldClearOnHeadRemoval(next: Node<T> | null): boolean {
        return !next;
    }

    public filter(predicate: Predicate<T>): Linear<T> {
        const list: Linear<T> = new Linear<T>();

        this.forEach((node: T) => {
            if (predicate(node)) {
                list.append(node);
            }
        });

        return list;
    }

    public forEach(consumer: Consumer<T>): this {
        let node: Node<T> | null = this._head;

        while (node) {
            consumer(node.value);
            node = node.next;
        }

        return this;
    }

    public includes(value: T): boolean {
        let node: Node<T> | null = this._head;

        while (node) {
            if (node.value === value) {
                return true;
            }
            node = node.next;
        }

        return false;
    }

    public indexOf(value: T): number {
        let counter: number = 0;
        let node: Node<T> | null = this._head;

        while (node) {
            if (node.value === value) {
                return counter;
            }
            counter++;
            node = node.next;
        }

        return -1;
    }

    public join(separator: string = ','): string {
        let result: string = '';
        let node: Node<T> | null = this._head;

        while (node) {
            result += String(node.value);

            if (node.next) {
                result += separator;
            }

            node = node.next;
        }

        return result;
    }

    public map<U>(mapper: Mapper<T, U>): Linear<U> {
        const list: Linear<U> = new Linear<U>();
        this.forEach((node: T) => list.append(mapper(node)));
        return list;
    }

    public reverse(): Linear<T> {
        const list: Linear<T> = new Linear<T>();
        this.forEach((node: T) => list.prepend(node));
        return list;
    }

    public toCircular(): Circular<T> {
        const list: Circular<T> = new Circular<T>();
        this.forEach((node: T) => list.append(node));
        return list;
    }
}

export default Linear;
