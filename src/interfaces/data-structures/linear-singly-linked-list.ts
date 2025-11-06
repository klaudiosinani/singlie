import {SinglyLinkedList} from './singly-linked-list';
import {CircularSinglyLinkedList} from './circular-singly-linked-list';

export interface LinearSinglyLinkedList<T> extends SinglyLinkedList<T> {
    /**
     * Converts this linear list to a circular list
     */
    toCircular(): CircularSinglyLinkedList<T>;
}
