import {describe, expect, it} from '@jest/globals';
import {Node} from '../src';
import fc from 'fast-check';

describe('Node Class', () => {
    describe('Node Initialization with Various Types', () => {
        const initTestCases = [
            {value: 0, type: 'number zero'},
            {value: 42, type: 'positive number'},
            {value: -10, type: 'negative number'},
            {value: 'hello', type: 'string'},
            {value: '', type: 'empty string'},
            {value: true, type: 'boolean true'},
            {value: false, type: 'boolean false'},
            {value: null, type: 'null value'},
            {value: undefined, type: 'undefined value'},
            {value: {id: 1, name: 'Mario'}, type: 'object'},
            {value: [1, 2, 3], type: 'array'},
            {value: Symbol('test'), type: 'symbol'},
        ];

        initTestCases.forEach(({value, type}) => {
            it(`should initialize with ${type}: ${JSON.stringify(value)}`, () => {
                const node = new Node(value);

                expect(node.value).toBe(value);
                expect(node.next).toBeNull();
            });

            it(`${type} node should be properly typed`, () => {
                const node = new Node(value);

                expect(typeof node.value === typeof value).toBe(true);
                expect(node.next).toBeNull();
            });
        });

        it('[Property] node always initializes with null next', () => {
            fc.assert(
                fc.property(fc.anything(), (value) => {
                    const node = new Node(value);
                    return node.next === null;
                })
            );
        });

        it('[Property] node value is preserved exactly', () => {
            fc.assert(
                fc.property(fc.integer(), (value) => {
                    const node = new Node(value);
                    return node.value === value;
                })
            );
        });
    });

    describe('Node Property Mutations', () => {
        const mutationCases = [
            {initial: 1, next: 2, description: '1 -> 2'},
            {initial: 0, next: 100, description: '0 -> 100'},
            {initial: -5, next: 5, description: '-5 -> 5'},
            {initial: 42, next: 42, description: 'same value'},
        ];

        mutationCases.forEach(({initial, next, description}) => {
            it(`should modify value: ${description}`, () => {
                const node = new Node<number>(initial);
                node.value = next;

                expect(node.value).toBe(next);
                expect(node.next).toBeNull();
            });
        });

        it('[Property] value mutation works for any value', () => {
            fc.assert(
                fc.property(fc.tuple(fc.integer(), fc.integer()), ([initial, updated]) => {
                    const node = new Node<number>(initial);
                    node.value = updated;
                    return node.value === updated;
                })
            );
        });
    });

    describe('Node Linking Operations', () => {
        const linkCases = [
            {description: 'two nodes in sequence'},
            {description: 'chain of three nodes'},
            {description: 'node pointing to itself'},
        ];

        linkCases.forEach(({description}) => {
            it(`should link nodes: ${description}`, () => {
                const node1 = new Node(1);
                const node2 = new Node(2);

                node1.next = node2;

                expect(node1.value).toBe(1);
                expect(node1.next).toBe(node2);
                expect(node1.next!.value).toBe(2);
                expect(node2.next).toBeNull();
            });
        });

        it('should create circular reference', () => {
            const node = new Node<number>(42);
            node.next = node;

            expect(node.next).toBe(node);
            expect(node.next!.value).toBe(42);
        });

        it('should chain multiple nodes', () => {
            const nodes = [new Node(1), new Node(2), new Node(3), new Node(4)];

            for (let i = 0; i < nodes.length - 1; i++) {
                nodes[i].next = nodes[i + 1];
            }

            expect(nodes[0].next).toBe(nodes[1]);
            expect(nodes[1].next).toBe(nodes[2]);
            expect(nodes[2].next).toBe(nodes[3]);
            expect(nodes[3].next).toBeNull();
        });

        it('[Property] linked nodes maintain reference integrity', () => {
            fc.assert(
                fc.property(fc.tuple(fc.integer(), fc.integer()), ([val1, val2]) => {
                    const node1 = new Node(val1);
                    const node2 = new Node(val2);

                    node1.next = node2;

                    return (
                        node1.value === val1 &&
                        node1.next === node2 &&
                        node2.value === val2 &&
                        node2.next === null
                    );
                })
            );
        });
    });

    describe('Node with Different Data Types', () => {
        describe('String values', () => {
            const stringCases = [
                {value: 'hello', description: 'simple string'},
                {value: 'world!', description: 'string with punctuation'},
                {value: '', description: 'empty string'},
                {value: ' ', description: 'single space'},
                {value: 'multi line\nstring', description: 'multiline string'},
            ];

            stringCases.forEach(({value, description}) => {
                it(`should store ${description}`, () => {
                    const node = new Node<string>(value);
                    expect(node.value).toBe(value);
                });
            });

            it('[Property] string node value is preserved', () => {
                fc.assert(
                    fc.property(fc.string(), (str) => {
                        const node = new Node(str);
                        return node.value === str;
                    })
                );
            });
        });

        describe('Object values', () => {
            interface User {
                id: number;
                name: string;
                email?: string;
            }

            const objectCases: User[] = [
                {id: 1, name: 'Mario'},
                {id: 2, name: 'Klaudio', email: 'klaudio@example.com'},
                {id: 0, name: ''},
            ];

            objectCases.forEach((user) => {
                it(`should store object with id ${user.id}`, () => {
                    const node = new Node<User>(user);

                    expect(node.value.id).toBe(user.id);
                    expect(node.value.name).toBe(user.name);
                });
            });

            it('should maintain object reference', () => {
                const user: User = {id: 1, name: 'Mario'};
                const node = new Node(user);

                user.email = 'mario@example.com';

                expect(node.value.email).toBe('mario@example.com');
            });
        });

        describe('Array values', () => {
            const arrayCases = [[1, 2, 3], ['a', 'b', 'c'], [], [42]];

            arrayCases.forEach((arr) => {
                it(`should store array: [${arr.join(', ')}]`, () => {
                    const node = new Node(arr);

                    expect(Array.isArray(node.value)).toBe(true);
                    expect(node.value).toEqual(arr);
                    expect(node.value.length).toBe(arr.length);
                });
            });
        });
    });

    describe('Node Traversal', () => {
        it('should traverse simple chain', () => {
            const chain = [new Node(1), new Node(2), new Node(3)];

            chain[0].next = chain[1];
            chain[1].next = chain[2];

            const values: number[] = [];
            let current: Node<number> | null = chain[0];
            while (current) {
                values.push(current.value);
                current = current.next;
            }

            expect(values).toEqual([1, 2, 3]);
        });

        it('[Property] traversal counts correct number of nodes', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 10}), (values) => {
                    const nodes = values.map((v) => new Node(v));

                    for (let i = 0; i < nodes.length - 1; i++) {
                        nodes[i].next = nodes[i + 1];
                    }

                    let count = 0;
                    let current: Node<number> | null = nodes[0];
                    while (current) {
                        count++;
                        current = current.next;
                    }

                    return count === values.length;
                })
            );
        });

        it('should handle circular traversal with limit', () => {
            const node = new Node(1);
            node.next = node;

            let count = 0;
            let current: Node<number> | null = node;
            const limit = 5;

            while (current && count < limit) {
                count++;
                current = current.next;
            }

            expect(count).toBe(limit);
        });
    });

    describe('Node Memory and Reference', () => {
        it('should maintain separate node instances', () => {
            const node1 = new Node(1);
            const node2 = new Node(1);

            expect(node1).not.toBe(node2);
            expect(node1.value).toBe(node2.value);
        });

        it('should allow reassigning next pointer', () => {
            const node1 = new Node(1);
            const node2 = new Node(2);
            const node3 = new Node(3);

            node1.next = node2;
            expect(node1.next).toBe(node2);

            node1.next = node3;
            expect(node1.next).toBe(node3);
            expect(node1.next).not.toBe(node2);
        });

        it('should support unlinking by setting next to null', () => {
            const node1 = new Node(1);
            const node2 = new Node(2);

            node1.next = node2;
            expect(node1.next).toBe(node2);

            node1.next = null;
            expect(node1.next).toBeNull();
        });
    });

    describe('Node Edge Cases', () => {
        it('should handle node with null value', () => {
            const node = new Node<number | null>(null);

            expect(node.value).toBeNull();
            expect(node.next).toBeNull();
        });

        it('should handle node with undefined value', () => {
            const node = new Node<number | undefined>(undefined);

            expect(node.value).toBeUndefined();
            expect(node.next).toBeNull();
        });

        it('should handle very large numbers', () => {
            const largeNum = Number.MAX_SAFE_INTEGER;
            const node = new Node(largeNum);

            expect(node.value).toBe(largeNum);
        });

        it('should handle very small numbers', () => {
            const smallNum = Number.MIN_SAFE_INTEGER;
            const node = new Node(smallNum);

            expect(node.value).toBe(smallNum);
        });

        it('[Property] node works with any safe integer', () => {
            fc.assert(
                fc.property(fc.integer(), (num) => {
                    const node = new Node(num);
                    return node.value === num && node.next === null;
                })
            );
        });
    });

    describe('Node Type Safety', () => {
        it('should preserve number type', () => {
            const node = new Node<number>(42);
            const value: number = node.value;

            expect(typeof value).toBe('number');
        });

        it('should preserve string type', () => {
            const node = new Node<string>('hello');
            const value: string = node.value;

            expect(typeof value).toBe('string');
        });

        it('should preserve object type', () => {
            interface Item {
                id: number;
            }

            const item: Item = {id: 1};
            const node = new Node<Item>(item);

            expect(node.value.id).toBe(1);
        });

        it('should preserve generic array type', () => {
            const node = new Node<number[]>([1, 2, 3]);

            expect(Array.isArray(node.value)).toBe(true);
            expect(node.value[0]).toBe(1);
        });
    });

    describe('Node Chaining Patterns', () => {
        it('should build forward chain', () => {
            const head = new Node(1);
            let current = head;

            for (let i = 2; i <= 5; i++) {
                current.next = new Node(i);
                current = current.next;
            }

            const values: number[] = [];
            let node: Node<number> | null = head;
            while (node) {
                values.push(node.value);
                node = node.next;
            }

            expect(values).toEqual([1, 2, 3, 4, 5]);
        });

        it('should allow complex linking patterns', () => {
            const nodes = Array.from({length: 5}, (_, i) => new Node(i));

            nodes[0].next = nodes[2];
            nodes[2].next = nodes[4];
            nodes[4].next = nodes[1];
            nodes[1].next = nodes[3];

            const values: number[] = [];
            let current: Node<number> | null = nodes[0];
            while (current) {
                values.push(current.value);
                current = current.next;
            }

            expect(values).toEqual([0, 2, 4, 1, 3]);
        });
    });
});
