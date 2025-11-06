import {LinearSinglyLinkedList} from './linear-singly-linked-list';
import {SinglyLinkedList} from './singly-linked-list';

export interface CircularSinglyLinkedList<T> extends SinglyLinkedList<T> {
    /**
     * Converts this circular list to a linear list
     */
    toLinear(): LinearSinglyLinkedList<T>;
}
