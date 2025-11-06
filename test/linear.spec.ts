import {beforeEach, describe, expect, it} from '@jest/globals'
import {Linear} from '../src';
import fc from 'fast-check';

describe('Linear Singly Linked List - Empty State', () => {
    let linear: Linear<number>;

    beforeEach(() => {
        linear = new Linear<number>();
    });

    describe('Basic Properties', () => {
        it('should always be empty when initialized', () => {
            expect(linear.isEmpty()).toBe(true);
            expect(linear.head).toBeNull();
            expect(linear.last).toBeNull();
            expect(linear.length).toBe(0);
        });

        it('[Property] empty list has null head and last', () => {
            fc.assert(
                fc.property(fc.constant(linear), (list) => {
                    const isEmpty = list.isEmpty();
                    const headIsNull = list.head === null;
                    const lastIsNull = list.last === null;

                    return isEmpty === (headIsNull && lastIsNull);
                })
            );
        });

        it('[Property] empty list length is always zero', () => {
            fc.assert(
                fc.property(fc.constant(linear), (list) => {
                    return list.length === 0;
                })
            );
        });
    });

    describe('Access Operations', () => {
        const errorTestCases = [
            {index: 0, description: 'index 0'},
            {index: -1, description: 'negative index -1'},
            {index: 100, description: 'large index 100'},
        ];

        errorTestCases.forEach(({index, description}) => {
            it(`should throw RangeError when getting element at ${description}`, () => {
                expect(() => linear.get(index)).toThrow(RangeError);
                expect(() => linear.get(index)).toThrow('List index out of bounds');
            });

            it(`should throw RangeError when accessing node at ${description}`, () => {
                expect(() => linear.node(index)).toThrow(RangeError);
            });

            it(`should throw RangeError when removing from ${description}`, () => {
                expect(() => linear.remove(index)).toThrow(RangeError);
            });

            it(`should throw RangeError when setting at ${description}`, () => {
                expect(() => linear.set({index, value: 42})).toThrow(RangeError);
            });
        });

        it('[Property] get/node/remove/set always throw on any index in empty list', () => {
            fc.assert(
                fc.property(fc.integer(), (index) => {
                    expect(() => linear.get(index)).toThrow(RangeError);
                    expect(() => linear.node(index)).toThrow(RangeError);
                    expect(() => linear.remove(index)).toThrow(RangeError);
                    expect(() => linear.set({index, value: 42})).toThrow(RangeError);
                    return true;
                })
            );
        });
    });

    describe('Conversion Operations', () => {
        it('should always convert to empty array', () => {
            expect(linear.toArray()).toEqual([]);
            expect(linear.toArray()).toHaveLength(0);
        });

        const separatorTestCases = [
            {separator: ',', description: 'default comma'},
            {separator: ' ', description: 'space'},
            {separator: '-', description: 'dash'},
            {separator: '|', description: 'pipe'},
            {separator: '', description: 'empty string'},
        ];

        separatorTestCases.forEach(({separator, description}) => {
            it(`should join to empty string with ${description} separator`, () => {
                expect(linear.join(separator)).toBe('');
            });
        });

        it('[Property] join with any separator returns empty string', () => {
            fc.assert(
                fc.property(fc.string(), (separator) => {
                    return linear.join(separator) === '';
                })
            );
        });

        it('should convert to empty string', () => {
            expect(linear.toString()).toBe('');
        });

        it('should convert empty linear list to empty circular list', () => {
            const linear = new Linear<number>();
            const circular = linear.toCircular();

            expect(circular.isEmpty()).toBe(true);
            expect(circular.length).toBe(0);
        });
    });

    describe('Transformation Operations', () => {
        it('should map to empty list', () => {
            const mapped = linear.map((x) => x * 2);
            expect(mapped.isEmpty()).toBe(true);
            expect(mapped.toArray()).toEqual([]);
        });

        it('[Property] map preserves emptiness with any function', () => {
            fc.assert(
                fc.property(
                    fc.func(fc.integer()),
                    (fn) => {
                        const mapped = linear.map(fn);
                        return mapped.isEmpty();
                    }
                )
            );
        });

        it('should reverse to empty list', () => {
            const reversed = linear.reverse();
            expect(reversed.isEmpty()).toBe(true);
        });

        it('should filter to empty list', () => {
            const filtered = linear.filter(() => true);
            expect(filtered.isEmpty()).toBe(true);
        });

        it('should clear return same instance', () => {
            const cleared = linear.clear();
            expect(cleared).toBe(linear);
            expect(cleared.isEmpty()).toBe(true);
        });
    });

    describe('Aggregation Operations', () => {
        it('should reduce to initial value', () => {
            const result = linear.reduce((acc, x) => acc + x, 100);
            expect(result).toBe(100);
        });

        it('[Property] reduce always returns initial value', () => {
            fc.assert(
                fc.property(fc.integer(), (initialValue) => {
                    return linear.reduce((acc, x) => acc + x, initialValue) === initialValue;
                })
            );
        });

        it('should not iterate on empty list', () => {
            const callback = jest.fn();
            linear.forEach(callback);
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('Search Operations', () => {
        const searchTestCases = [
            {value: 0, description: 'zero'},
            {value: 42, description: 'positive number'},
            {value: -1, description: 'negative number'},
        ];

        searchTestCases.forEach(({value, description}) => {
            it(`should return false for includes(${description})`, () => {
                expect(linear.includes(value)).toBe(false);
            });

            it(`should return -1 for indexOf(${description})`, () => {
                expect(linear.indexOf(value)).toBe(-1);
            });
        });

        it('[Property] includes always returns false for any value', () => {
            fc.assert(
                fc.property(fc.integer(), (value) => {
                    return linear.includes(value) === false;
                })
            );
        });

        it('[Property] indexOf always returns -1 for any value', () => {
            fc.assert(
                fc.property(fc.integer(), (value) => {
                    return linear.indexOf(value) === -1;
                })
            );
        });
    });
});

describe('Linear Singly Linked List - Single Element', () => {
    describe('append with various types', () => {
        const singleElementTestCases: Array<{ value: number; type: string }> = [
            {value: 0, type: 'zero'},
            {value: 42, type: 'positive'},
            {value: -10, type: 'negative'},
            {value: Number.MAX_SAFE_INTEGER, type: 'max safe integer'},
            {value: Number.MIN_SAFE_INTEGER, type: 'min safe integer'},
        ];

        singleElementTestCases.forEach(({value, type}) => {
            it(`should append single ${type} element: ${value}`, () => {
                const list = new Linear<number>();
                list.append(value);

                expect(list.head).not.toBeNull();
                expect(list.head!.value).toBe(value);
                expect(list.last).toBe(list.head);
                expect(list.length).toBe(1);
                expect(list.isEmpty()).toBe(false);
            });

            it(`should get ${type} element at index 0: ${value}`, () => {
                const list = new Linear<number>();
                list.append(value);
                expect(list.get(0)).toBe(value);
            });

            it(`should set ${type} element value: ${value} -> ${value * 2}`, () => {
                const list = new Linear<number>();
                list.append(value);
                list.set({index: 0, value: value * 2});
                expect(list.get(0)).toBe(value * 2);
            });
        });

        it('[Property] append single element always creates list of length 1', () => {
            fc.assert(
                fc.property(fc.integer(), (value) => {
                    const list = new Linear<number>();
                    list.append(value);
                    return list.length === 1;
                })
            );
        });

        it('[Property] single element: head equals last', () => {
            fc.assert(
                fc.property(fc.integer(), (value) => {
                    const list = new Linear<number>();
                    list.append(value);
                    return list.head === list.last;
                })
            );
        });

        it('[Property] single element: get(0) returns appended value', () => {
            fc.assert(
                fc.property(fc.integer(), (value) => {
                    const list = new Linear<number>();
                    list.append(value);
                    return list.get(0) === value;
                })
            );
        });
    });

    describe('Modifications with various values', () => {
        const modificationTestCases = [
            {initial: 1, updated: 10, description: '1 -> 10'},
            {initial: 0, updated: 100, description: '0 -> 100'},
            {initial: -5, updated: 5, description: '-5 -> 5'},
            {initial: 42, updated: 42, description: 'same value'},
        ];

        modificationTestCases.forEach(({initial, updated, description}) => {
            it(`should update value: ${description}`, () => {
                const list = new Linear<number>();
                list.append(initial);
                list.set({index: 0, value: updated});
                expect(list.get(0)).toBe(updated);
            });
        });
    });

    describe('Conversions', () => {
        const conversionTestCases = [
            {value: 123, expected: '123'},
            {value: 0, expected: '0'},
            {value: -42, expected: '-42'},
        ];

        conversionTestCases.forEach(({value, expected}) => {
            it(`should convert to array and string: ${value}`, () => {
                const list = new Linear<number>();
                list.append(value);
                expect(list.toArray()).toEqual([value]);
                expect(list.toString()).toBe(expected);
                expect(list.join('|')).toBe(expected);
            });
        });

        it('[Property] toArray with single element has length 1', () => {
            fc.assert(
                fc.property(fc.integer(), (value) => {
                    const list = new Linear<number>();
                    list.append(value);
                    return list.toArray().length === 1;
                })
            );
        });

        it('should convert single element linear list to circular list', () => {
            const linear = new Linear<number>();
            linear.append(42);
            const circular = linear.toCircular();

            expect(circular.isEmpty()).toBe(false);
            expect(circular.length).toBe(1);
            expect(circular.get(0)).toBe(42);
        });
    });
});

describe('Linear Singly Linked List - Multiple Elements', () => {
    describe('append multiple elements', () => {
        const multipleAppendTestCases = [
            {values: [1, 2], description: 'two elements'},
            {values: [5, 10, 15], description: 'three elements'},
            {values: [0, -1, -2, -3], description: 'four elements with negatives'},
        ];

        multipleAppendTestCases.forEach(({values, description}) => {
            it(`should append ${description}: ${values.join(', ')}`, () => {
                const list = new Linear<number>();
                list.append(...values);

                expect(list.head!.value).toBe(values[0]);
                expect(list.last!.value).toBe(values[values.length - 1]);
                expect(list.length).toBe(values.length);
                expect(list.toArray()).toEqual(values);
            });
        });

        it('[Property] multiple appends match input array', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1}), (values) => {
                    const list = new Linear<number>();
                    list.append(...values);
                    return JSON.stringify(list.toArray()) === JSON.stringify(values);
                })
            );
        });

        it('[Property] length after multiple appends equals input count', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1}), (values) => {
                    const list = new Linear<number>();
                    list.append(...values);
                    return list.length === values.length;
                })
            );
        });
    });

    describe('access various indices', () => {
        const accessTestCases = [
            {values: [10, 20, 30], indices: [0, 1, 2], description: 'all indices'},
            {values: [5, 15, 25, 35], indices: [0, 3], description: 'head and tail'},
            {values: [100, 200, 300], indices: [1], description: 'middle element'},
        ];

        accessTestCases.forEach(({values, indices, description}) => {
            it(`should access ${description}: ${indices.join(', ')}`, () => {
                const list = new Linear<number>();
                list.append(...values);

                indices.forEach((index) => {
                    expect(list.get(index)).toBe(values[index]);
                });
            });
        });

        it('[Property] get at valid index returns correct value', () => {
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

    describe('remove operations', () => {
        const removeTestCases = [
            {values: [1, 2, 3], removeIndex: 0, expected: [2, 3]},
            {values: [1, 2, 3], removeIndex: 1, expected: [1, 3]},
            {values: [1, 2, 3], removeIndex: 2, expected: [1, 2]},
            {values: [10], removeIndex: 0, expected: []},
        ];

        removeTestCases.forEach(({values, removeIndex, expected}) => {
            it(`should remove index ${removeIndex} from [${values.join(', ')}]`, () => {
                const list = new Linear<number>();
                list.append(...values);
                list.remove(removeIndex);
                expect(list.toArray()).toEqual(expected);
            });
        });

        it('[Property] remove valid index reduces length by 1', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.integer(), {minLength: 1, maxLength: 10}),
                    (values) => {
                        const list = new Linear<number>();
                        list.append(...values);
                        const initialLength = list.length;

                        const validIndex = Math.floor(Math.random() * initialLength);
                        list.remove(validIndex);

                        return list.length === initialLength - 1;
                    }
                )
            );
        });
    });

    describe('search operations', () => {
        const searchTestCases = [
            {values: [1, 2, 3, 4, 5], searchValue: 3, expectedIndex: 2},
            {values: [10, 20, 30], searchValue: 10, expectedIndex: 0},
            {values: [5, 15, 25], searchValue: 25, expectedIndex: 2},
            {values: [1, 2, 3], searchValue: 99, expectedIndex: -1},
        ];

        searchTestCases.forEach(({values, searchValue, expectedIndex}) => {
            it(`should find ${searchValue} in [${values.join(', ')}] at index ${expectedIndex}`, () => {
                const list = new Linear<number>();
                list.append(...values);

                expect(list.indexOf(searchValue)).toBe(expectedIndex);
                if (expectedIndex >= 0) {
                    expect(list.includes(searchValue)).toBe(true);
                } else {
                    expect(list.includes(searchValue)).toBe(false);
                }
            });
        });

        it('[Property] indexOf returns -1 for non-existent values', () => {
            fc.assert(
                fc.property(
                    fc.tuple(
                        fc.array(fc.integer({min: 0, max: 10}), {minLength: 1, maxLength: 5}),
                        fc.integer({min: 100, max: 1000})
                    ),
                    ([values, searchValue]) => {
                        if (values.includes(searchValue)) return true;

                        const list = new Linear<number>();
                        list.append(...values);
                        return list.indexOf(searchValue) === -1;
                    }
                )
            );
        });
    });

    describe('transformation operations', () => {
        const transformTestCases = [
            {values: [1, 2, 3], mapper: (x: number) => x * 2, expected: [2, 4, 6]},
            {values: [5, 10, 15], mapper: (x: number) => x / 5, expected: [1, 2, 3]},
            {values: [1, 2], mapper: (x: number) => -x, expected: [-1, -2]},
        ];

        transformTestCases.forEach(({values, mapper, expected}) => {
            it(`should map [${values.join(', ')}] correctly`, () => {
                const list = new Linear<number>();
                list.append(...values);
                const mapped = list.map(mapper);
                expect(mapped.toArray()).toEqual(expected);
            });
        });

        it('[Property] map preserves length', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1}), (values) => {
                    const list = new Linear<number>();
                    list.append(...values);
                    const mapped = list.map((x) => x * 2);
                    return mapped.length === list.length;
                })
            );
        });

        it('[Property] reverse reverses order', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 10}), (values) => {
                    const list = new Linear<number>();
                    list.append(...values);
                    const reversed = list.reverse();
                    return JSON.stringify(reversed.toArray()) === JSON.stringify([...values].reverse());
                })
            );
        });
    });

    describe('reduce operations', () => {
        const reduceTestCases = [
            {values: [1, 2, 3], reducer: (a: number, b: number) => a + b, init: 0, expected: 6},
            {values: [2, 3, 4], reducer: (a: number, b: number) => a * b, init: 1, expected: 24},
            {values: [5, 10, 15], reducer: (a: number, b: number) => Math.max(a, b), init: 0, expected: 15},
        ];

        reduceTestCases.forEach(({values, reducer, init, expected}) => {
            it(`should reduce [${values.join(', ')}] to ${expected}`, () => {
                const list = new Linear<number>();
                list.append(...values);
                expect(list.reduce(reducer, init)).toBe(expected);
            });
        });
    });

    describe('filter operations', () => {
        const filterTestCases = [
            {
                values: [1, 2, 3, 4, 5],
                predicate: (x: number) => x % 2 === 0,
                expected: [2, 4],
            },
            {
                values: [10, 20, 30, 40],
                predicate: (x: number) => x > 25,
                expected: [30, 40],
            },
        ];

        filterTestCases.forEach(({values, predicate, expected}) => {
            it(`should filter [${values.join(', ')}] correctly`, () => {
                const list = new Linear<number>();
                list.append(...values);
                const filtered = list.filter(predicate);
                expect(filtered.toArray()).toEqual(expected);
            });
        });

        it('[Property] filter preserves element order', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1}), (values) => {
                    const list = new Linear<number>();
                    list.append(...values);
                    const filtered = list.filter((x) => x > 0);
                    const expected = values.filter((x) => x > 0);
                    return JSON.stringify(filtered.toArray()) === JSON.stringify(expected);
                })
            );
        });
    });

    describe('join operations', () => {
        const joinTestCases = [
            {values: [1, 2, 3], separator: ',', expected: '1,2,3'},
            {values: [10, 20], separator: '-', expected: '10-20'},
            {values: [5], separator: '|', expected: '5'},
        ];

        joinTestCases.forEach(({values, separator, expected}) => {
            it(`should join [${values.join(', ')}] with '${separator}'`, () => {
                const list = new Linear<number>();
                list.append(...values);
                expect(list.join(separator)).toBe(expected);
            });
        });

        it('linear join used default delimiter when one is not provided', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 5}), (values) => {
                    const list = new Linear<number>();
                    list.append(...values);
                    const joined = list.join();

                    return typeof joined === 'string' && joined.length > 0 && joined.split(',').length === values.length;
                })
            );
        });
    });

    describe('toCircular conversion', () => {
        it('should convert multiple elements linear list to circular list', () => {
            const linear = new Linear<number>();
            linear.append(1, 2, 3, 4, 5);
            const circular = linear.toCircular();

            expect(circular.length).toBe(5);
            expect(circular.toArray()).toEqual([1, 2, 3, 4, 5]);
        });

        it('[Property] toCircular preserves all elements and order', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 0, maxLength: 10}), (values) => {
                    const linear = new Linear<number>();
                    linear.append(...values);
                    const circular = linear.toCircular();

                    return circular.length === linear.length &&
                        JSON.stringify(circular.toArray()) === JSON.stringify(linear.toArray());
                })
            );
        });
    });
});


