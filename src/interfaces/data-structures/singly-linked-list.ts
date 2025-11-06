import {Node} from '../../node';

/**
 * Core operations for singly linked lists
 */
export interface SinglyLinkedList<T> {
    readonly head: Node<T> | null;
    readonly last: Node<T> | null;
    readonly length: number;

    append(...values: T[]): SinglyLinkedList<T>;

    prepend(...values: T[]): SinglyLinkedList<T>;

    insert(options: { value: T | T[]; index: number }): SinglyLinkedList<T>;

    remove(index: number): SinglyLinkedList<T>;

    clear(): SinglyLinkedList<T>;

    get(index: number): T;

    set(options: { value: T; index: number }): SinglyLinkedList<T>;

    node(index: number): Node<T>;

    isEmpty(): boolean;
}
