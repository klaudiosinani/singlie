import {describe, expect, it} from '@jest/globals';
import {Linear} from '../src';
import fc from 'fast-check';

describe('List Abstract Class - Core Functionality', () => {
    describe('Index Validation and Bounds Checking', () => {
        describe('Valid index tests', () => {
            const validIndexCases = [
                {
                    list: () => {
                        const l = new Linear<number>();
                        l.append(1);
                        return l;
                    }, indices: [0], description: 'single element'
                },
                {
                    list: () => {
                        const l = new Linear<number>();
                        l.append(1, 2, 3);
                        return l;
                    }, indices: [0, 1, 2], description: 'three elements'
                },
                {
                    list: () => {
                        const l = new Linear<number>();
                        l.append(...Array.from({length: 10}, (_, i) => i));
                        return l;
                    }, indices: [0, 5, 9], description: 'ten elements'
                },
            ];

            validIndexCases.forEach(({list: createList, indices, description}) => {
                it(`should accept valid indices for ${description}`, () => {
                    const list = createList();

                    indices.forEach((index) => {
                        expect(() => list.get(index)).not.toThrow();
                    });
                });
            });

            it('[Property] valid indices are always within bounds', () => {
                fc.assert(
                    fc.property(
                        fc.array(fc.integer(), {minLength: 1, maxLength: 10}),
                        (values) => {
                            const list = new Linear<number>();
                            list.append(...values);

                            for (let i = 0; i < values.length; i++) {
                                expect(() => list.get(i)).not.toThrow();
                            }
                            return true;
                        }
                    )
                );
            });
        });

        describe('Invalid index tests', () => {
            const invalidIndexCases = [
                {index: -1, description: 'negative index'},
                {index: 100, description: 'way out of bounds'},
            ];

            invalidIndexCases.forEach(({index, description}) => {
                it(`should throw RangeError for ${description}: ${index}`, () => {
                    const list = new Linear<number>();
                    list.append(1, 2, 3);

                    expect(() => list.get(index)).toThrow(RangeError);
                    expect(() => list.get(index)).toThrow('List index out of bounds');
                });
            });

            it('[Property] any index >= length throws error', () => {
                fc.assert(
                    fc.property(
                        fc.tuple(
                            fc.array(fc.integer(), {minLength: 1, maxLength: 10}),
                            fc.integer({min: 1000, max: 2000})
                        ),
                        ([values, invalidIndex]) => {
                            const list = new Linear<number>();
                            list.append(...values);

                            expect(() => list.get(invalidIndex)).toThrow(RangeError);
                            return true;
                        }
                    )
                );
            });
        });
    });

    describe('Array Normalization', () => {
        describe('Single value normalization', () => {
            const singleCases = [
                {value: 1, type: 'single number'},
                {value: 'hello', type: 'single string'},
                {value: {id: 1}, type: 'single object'},
            ];

            singleCases.forEach(({value, type}) => {
                it(`should normalize ${type} to array`, () => {
                    const list = new Linear<any>();
                    list.append(value);

                    expect(list.toArray()).toEqual([value]);
                });
            });

            it('[Property] single value always becomes single element array', () => {
                fc.assert(
                    fc.property(fc.integer(), (value) => {
                        const list = new Linear<number>();
                        list.append(value);
                        return list.toArray().length === 1;
                    })
                );
            });
        });

        describe('Array normalization', () => {
            const arrayCases = [
                {values: [1], description: 'single item array'},
                {values: [1, 2, 3], description: 'three item array'},
                {values: Array.from({length: 10}, (_, i) => i), description: 'ten item array'},
            ];

            arrayCases.forEach(({values, description}) => {
                it(`should append ${description}`, () => {
                    const list = new Linear<number>();
                    list.append(...values);

                    expect(list.toArray()).toEqual(values);
                });
            });

            it('[Property] array spread appends all elements', () => {
                fc.assert(
                    fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 10}), (values) => {
                        const list = new Linear<number>();
                        list.append(...values);
                        return JSON.stringify(list.toArray()) === JSON.stringify(values);
                    })
                );
            });
        });
    });

    describe('Node Access and Traversal', () => {
        it('should access nodes at each position', () => {
            const list = new Linear<number>();
            list.append(10, 20, 30, 40, 50);

            expect(list.node(0).value).toBe(10);
            expect(list.node(1).value).toBe(20);
            expect(list.node(2).value).toBe(30);
            expect(list.node(3).value).toBe(40);
            expect(list.node(4).value).toBe(50);
        });

        it('should traverse all nodes', () => {
            const list = new Linear<number>();
            list.append(1, 2, 3, 4, 5);

            const values: number[] = [];
            for (let i = 0; i < list.length; i++) {
                values.push(list.node(i).value);
            }

            expect(values).toEqual([1, 2, 3, 4, 5]);
        });

        it('[Property] node traversal matches toArray', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 10}), (values) => {
                    const list = new Linear<number>();
                    list.append(...values);

                    const traversed: number[] = [];
                    for (let i = 0; i < list.length; i++) {
                        traversed.push(list.node(i).value);
                    }

                    return JSON.stringify(traversed) === JSON.stringify(list.toArray());
                })
            );
        });
    });

    describe('List State Management', () => {
        describe('isEmpty checks', () => {
            it('should return true for empty list', () => {
                const list = new Linear<number>();
                expect(list.isEmpty()).toBe(true);
            });

            it('should return false for non-empty list', () => {
                const list = new Linear<number>();
                list.append(1);
                expect(list.isEmpty()).toBe(false);
            });

            it('should return true after clearing', () => {
                const list = new Linear<number>();
                list.append(1, 2, 3);
                list.clear();
                expect(list.isEmpty()).toBe(true);
            });

            it('[Property] isEmpty consistent with length', () => {
                fc.assert(
                    fc.property(fc.array(fc.integer(), {maxLength: 5}), (values) => {
                        const list = new Linear<number>();
                        if (values.length > 0) list.append(...values);

                        return list.isEmpty() === (list.length === 0);
                    })
                );
            });
        });

        describe('Head and Last pointers', () => {
            it('should set head and last for single element', () => {
                const list = new Linear<number>();
                list.append(42);

                expect(list.head).not.toBeNull();
                expect(list.last).not.toBeNull();
                expect(list.head!.value).toBe(42);
                expect(list.last!.value).toBe(42);
                expect(list.head).toBe(list.last);
            });

            it('should have different head and last for multiple elements', () => {
                const list = new Linear<number>();
                list.append(1, 2, 3);

                expect(list.head!.value).toBe(1);
                expect(list.last!.value).toBe(3);
                expect(list.head).not.toBe(list.last);
            });

            it('[Property] head and last are always set or both null', () => {
                fc.assert(
                    fc.property(fc.array(fc.integer(), {maxLength: 10}), (values) => {
                        const list = new Linear<number>();
                        if (values.length > 0) list.append(...values);

                        const bothNull = list.head === null && list.last === null;
                        const bothSet = list.head !== null && list.last !== null;

                        return bothNull || bothSet;
                    })
                );
            });
        });

        describe('Length tracking', () => {
            it('should track length correctly after append', () => {
                const list = new Linear<number>();
                expect(list.length).toBe(0);

                list.append(1);
                expect(list.length).toBe(1);

                list.append(2, 3);
                expect(list.length).toBe(3);
            });

            it('should track length correctly after remove', () => {
                const list = new Linear<number>();
                list.append(1, 2, 3);
                expect(list.length).toBe(3);

                list.remove(1);
                expect(list.length).toBe(2);
            });

            it('[Property] length equals number of elements', () => {
                fc.assert(
                    fc.property(fc.array(fc.integer(), {maxLength: 20}), (values) => {
                        const list = new Linear<number>();
                        if (values.length > 0) list.append(...values);

                        return list.length === values.length;
                    })
                );
            });
        });
    });

    describe('Reduce and Aggregation', () => {
        describe('Sum operations', () => {
            const sumCases = [
                {values: [1, 2, 3], expected: 6},
                {values: [0, 0, 0], expected: 0},
                {values: [10, -5, 3], expected: 8},
                {values: [100], expected: 100},
            ];

            sumCases.forEach(({values, expected}) => {
                it(`should sum [${values.join(', ')}] to ${expected}`, () => {
                    const list = new Linear<number>();
                    list.append(...values);

                    const sum = list.reduce((acc, x) => acc + x, 0);
                    expect(sum).toBe(expected);
                });
            });

            it('[Property] sum matches array reduce', () => {
                fc.assert(
                    fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 10}), (values) => {
                        const list = new Linear<number>();
                        list.append(...values);

                        const listSum = list.reduce((acc, x) => acc + x, 0);
                        const arraySum = values.reduce((acc, x) => acc + x, 0);

                        return listSum === arraySum;
                    })
                );
            });
        });

        describe('Product operations', () => {
            const productCases = [
                {values: [2, 3, 4], expected: 24},
                {values: [1], expected: 1},
                {values: [0, 5, 10], expected: 0},
            ];

            productCases.forEach(({values, expected}) => {
                it(`should multiply [${values.join(', ')}] to ${expected}`, () => {
                    const list = new Linear<number>();
                    list.append(...values);

                    const product = list.reduce((acc, x) => acc * x, 1);
                    expect(product).toBe(expected);
                });
            });
        });

        describe('String concatenation', () => {
            it('should concatenate strings', () => {
                const list = new Linear<string>();
                list.append('Hello', ' ', 'World', '!');

                const result = list.reduce((acc, x) => acc + x, '');
                expect(result).toBe('Hello World!');
            });

            it('[Property] string reduce works correctly', () => {
                fc.assert(
                    fc.property(fc.array(fc.string(), {minLength: 1, maxLength: 5}), (strings) => {
                        const list = new Linear<string>();
                        list.append(...strings);

                        const listResult = list.reduce((acc, x) => acc + x, '');
                        const arrayResult = strings.reduce((acc, x) => acc + x, '');

                        return listResult === arrayResult;
                    })
                );
            });
        });

        describe('Custom reducers', () => {
            it('should find maximum value', () => {
                const list = new Linear<number>();
                list.append(3, 1, 4, 1, 5, 9, 2, 6);

                const max = list.reduce((acc, x) => (acc > x ? acc : x), -Infinity);
                expect(max).toBe(9);
            });

            it('should find minimum value', () => {
                const list = new Linear<number>();
                list.append(3, 1, 4, 1, 5, 9, 2, 6);

                const min = list.reduce((acc, x) => (acc < x ? acc : x), Infinity);
                expect(min).toBe(1);
            });

            it('[Property] max finder preserves largest value', () => {
                fc.assert(
                    fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 10}), (values) => {
                        const list = new Linear<number>();
                        list.append(...values);

                        const listMax = list.reduce((acc, x) => (acc > x ? acc : x), -Infinity);
                        const arrayMax = Math.max(...values);

                        return listMax === arrayMax;
                    })
                );
            });
        });
    });

    describe('ToArray Conversion', () => {
        it('should convert empty list to empty array', () => {
            const list = new Linear<number>();
            expect(list.toArray()).toEqual([]);
        });

        it('should convert to array preserving order', () => {
            const list = new Linear<number>();
            list.append(10, 20, 30, 40, 50);

            expect(list.toArray()).toEqual([10, 20, 30, 40, 50]);
        });

        it('should return independent array', () => {
            const list = new Linear<number>();
            list.append(1, 2, 3);

            const arr1 = list.toArray();
            const arr2 = list.toArray();

            expect(arr1).toEqual(arr2);
            expect(arr1).not.toBe(arr2);
        });

        it('[Property] toArray matches original append order', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {maxLength: 10}), (values) => {
                    const list = new Linear<number>();
                    if (values.length > 0) list.append(...values);

                    return JSON.stringify(list.toArray()) === JSON.stringify(values);
                })
            );
        });
    });

    describe('ToString and Serialization', () => {
        it('should convert to default comma-separated string', () => {
            const list = new Linear<number>();
            list.append(1, 2, 3);

            expect(list.toString()).toBe('1,2,3');
        });

        it('should convert empty list to empty string', () => {
            const list = new Linear<number>();
            expect(list.toString()).toBe('');
        });

        it('should convert strings to readable format', () => {
            const list = new Linear<string>();
            list.append('hello', 'world');

            expect(list.toString()).toBe('hello,world');
        });

        it('[Property] toString never throws', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {maxLength: 10}), (values) => {
                    const list = new Linear<number>();
                    if (values.length > 0) list.append(...values);

                    expect(() => list.toString()).not.toThrow();
                    return typeof list.toString() === 'string';
                })
            );
        });
    });

    describe('Get and Set Operations', () => {
        describe('Get operations', () => {
            it('should get value at valid indices', () => {
                const list = new Linear<number>();
                list.append(10, 20, 30);

                expect(list.get(0)).toBe(10);
                expect(list.get(1)).toBe(20);
                expect(list.get(2)).toBe(30);
            });

            it('[Property] get returns correct element', () => {
                fc.assert(
                    fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 10}), (values) => {
                        const list = new Linear<number>();
                        list.append(...values);

                        for (let i = 0; i < values.length; i++) {
                            if (list.get(i) !== values[i]) return false;
                        }
                        return true;
                    })
                );
            });
        });

        describe('Set operations', () => {
            it('should set value at valid indices', () => {
                const list = new Linear<number>();
                list.append(1, 2, 3);

                list.set({index: 0, value: 10});
                list.set({index: 1, value: 20});
                list.set({index: 2, value: 30});

                expect(list.toArray()).toEqual([10, 20, 30]);
            });

            it('should maintain length after set', () => {
                const list = new Linear<number>();
                list.append(1, 2, 3);

                list.set({index: 1, value: 100});

                expect(list.length).toBe(3);
            });

            it('[Property] set modifies only specified index', () => {
                fc.assert(
                    fc.property(
                        fc.tuple(
                            fc.array(fc.integer({min: 1, max: 100}), {minLength: 1, maxLength: 5}),
                            fc.integer()
                        ),
                        ([values, _]) => {
                            const list = new Linear<number>();
                            list.append(...values);

                            const targetIndex = Math.abs(_) % list.length;
                            const newValue = 999;

                            list.set({index: targetIndex, value: newValue});

                            for (let i = 0; i < list.length; i++) {
                                if (i === targetIndex) {
                                    if (list.get(i) !== newValue) return false;
                                } else {
                                    if (list.get(i) !== values[i]) return false;
                                }
                            }
                            return true;
                        }
                    )
                );
            });
        });
    });

    describe('Clear Operation', () => {
        it('should clear list completely', () => {
            const list = new Linear<number>();
            list.append(1, 2, 3);

            list.clear();

            expect(list.isEmpty()).toBe(true);
            expect(list.length).toBe(0);
            expect(list.head).toBeNull();
            expect(list.last).toBeNull();
        });

        it('should return self for chaining', () => {
            const list = new Linear<number>();
            list.append(1, 2, 3);

            const result = list.clear();

            expect(result).toBe(list);
        });

        it('[Property] clear always results in empty list', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {maxLength: 20}), (values) => {
                    const list = new Linear<number>();
                    if (values.length > 0) list.append(...values);

                    list.clear();

                    return list.length === 0 && list.isEmpty();
                })
            );
        });
    });

    describe('Integration: Complex Operations', () => {
        it('should handle append then set then get', () => {
            const list = new Linear<number>();
            list.append(1, 2, 3);
            list.set({index: 1, value: 99});

            expect(list.get(1)).toBe(99);
        });

        it('should maintain consistency through multiple operations', () => {
            const list = new Linear<string>();
            list.append('a');
            expect(list.length).toBe(1);

            list.append('b', 'c');
            expect(list.length).toBe(3);

            list.set({index: 0, value: 'x'});
            expect(list.get(0)).toBe('x');

            const array = list.toArray();
            expect(array).toEqual(['x', 'b', 'c']);
        });

        it('[Property] list maintains integrity through random operations', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.tuple(fc.constant('append'), fc.integer()), {maxLength: 20}),
                    (operations) => {
                        const list = new Linear<number>();

                        operations.forEach(([op, value]) => {
                            if (op === 'append') {
                                list.append(value);
                            }
                        });

                        return list.length === operations.length && list.toArray().length === list.length;
                    }
                )
            );
        });
    });
});
