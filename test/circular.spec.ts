import {beforeEach, describe, expect, it} from '@jest/globals';
import {Circular} from '../src';
import fc from 'fast-check';

describe('Circular Singly Linked List - Empty State', () => {
    let circular: Circular<number>;

    beforeEach(() => {
        circular = new Circular<number>();
    });

    describe('Basic Properties', () => {
        it('should always be empty when initialized', () => {
            expect(circular.isEmpty()).toBe(true);
            expect(circular.head).toBeNull();
            expect(circular.last).toBeNull();
            expect(circular.length).toBe(0);
        });

        it('[Property] empty circular has null head and last', () => {
            fc.assert(
                fc.property(fc.constant(circular), (list) => {
                    const isEmpty = list.isEmpty();
                    const headIsNull = list.head === null;
                    const lastIsNull = list.last === null;

                    return isEmpty === (headIsNull && lastIsNull);
                })
            );
        });

        it('[Property] empty circular length is always zero', () => {
            fc.assert(
                fc.property(fc.constant(circular), (list) => {
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
                expect(() => circular.get(index)).toThrow(RangeError);
            });

            it(`should throw RangeError when accessing node at ${description}`, () => {
                expect(() => circular.node(index)).toThrow(RangeError);
            });

            it(`should throw RangeError when removing from ${description}`, () => {
                expect(() => circular.remove(index)).toThrow(RangeError);
            });

            it(`should throw RangeError when setting at ${description}`, () => {
                expect(() => circular.set({index, value: 42})).toThrow(RangeError);
            });
        });

        it('[Property] all access operations throw on any index in empty circular', () => {
            fc.assert(
                fc.property(fc.integer(), (index) => {
                    expect(() => circular.get(index)).toThrow(RangeError);
                    expect(() => circular.node(index)).toThrow(RangeError);
                    expect(() => circular.remove(index)).toThrow(RangeError);
                    expect(() => circular.set({index, value: 42})).toThrow(RangeError);
                    return true;
                })
            );
        });
    });

    describe('Conversion Operations', () => {
        it('should always convert to empty array', () => {
            expect(circular.toArray()).toEqual([]);
            expect(circular.toArray()).toHaveLength(0);
        });

        const separatorTestCases = [
            {separator: ',', description: 'default comma'},
            {separator: ' ', description: 'space'},
            {separator: '-', description: 'dash'},
        ];

        separatorTestCases.forEach(({separator, description}) => {
            it(`should join to empty string with ${description} separator`, () => {
                expect(circular.join(separator)).toBe('');
            });
        });

        it('[Property] join with any separator returns empty string', () => {
            fc.assert(
                fc.property(fc.string(), (separator) => {
                    return circular.join(separator) === '';
                })
            );
        });
    });

    describe('Transformation Operations', () => {
        it('should map to empty circular list', () => {
            const mapped = circular.map((x) => x * 2);
            expect(mapped.isEmpty()).toBe(true);
        });

        it('[Property] map preserves emptiness', () => {
            fc.assert(
                fc.property(
                    fc.func(fc.integer()),
                    (fn) => {
                        const mapped = circular.map(fn);
                        return mapped.isEmpty();
                    }
                )
            );
        });

        it('should reverse to empty list', () => {
            const reversed = circular.reverse();
            expect(reversed.isEmpty()).toBe(true);
        });

        it('should filter to empty list', () => {
            const filtered = circular.filter(() => true);
            expect(filtered.isEmpty()).toBe(true);
        });
    });

    describe('Aggregation Operations', () => {
        it('should reduce to initial value', () => {
            const result = circular.reduce((acc, x) => acc + x, 100);
            expect(result).toBe(100);
        });

        it('[Property] reduce always returns initial value for empty', () => {
            fc.assert(
                fc.property(fc.integer(), (initialValue) => {
                    return circular.reduce((acc, x) => acc + x, initialValue) === initialValue;
                })
            );
        });

        it('should not iterate on empty circular', () => {
            const callback = jest.fn();
            circular.forEach(callback);
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('Search Operations', () => {
        it('[Property] includes always returns false for any value', () => {
            fc.assert(
                fc.property(fc.integer(), (value) => {
                    return circular.includes(value) === false;
                })
            );
        });

        it('[Property] indexOf always returns -1 for any value', () => {
            fc.assert(
                fc.property(fc.integer(), (value) => {
                    return circular.indexOf(value) === -1;
                })
            );
        });
    });

    describe('Circular Structure', () => {
        it('should maintain null head/last for empty state', () => {
            expect(circular.head).toBeNull();
            expect(circular.last).toBeNull();
        });
    });
});

describe('Circular Singly Linked List - Single Element', () => {
    describe('append with various types', () => {
        const singleElementTestCases: Array<{ value: number; type: string }> = [
            {value: 0, type: 'zero'},
            {value: 42, type: 'positive'},
            {value: -10, type: 'negative'},
            {value: Number.MAX_SAFE_INTEGER, type: 'max safe integer'},
        ];

        singleElementTestCases.forEach(({value, type}) => {
            it(`should append single ${type} element: ${value}`, () => {
                const list = new Circular<number>();
                list.append(value);

                expect(list.head).not.toBeNull();
                expect(list.head!.value).toBe(value);
                expect(list.last).toBe(list.head);
                expect(list.head!.next).toBe(list.head);
            });

            it(`should get ${type} element at index 0: ${value}`, () => {
                const list = new Circular<number>();
                list.append(value);
                expect(list.get(0)).toBe(value);
            });

            it(`single ${type} element circular reference is self: ${value}`, () => {
                const list = new Circular<number>();
                list.append(value);
                expect(list.head!.next).toBe(list.head);
            });
        });

        it('[Property] single element has circular reference to itself', () => {
            fc.assert(
                fc.property(fc.integer(), (value) => {
                    const list = new Circular<number>();
                    list.append(value);
                    return list.head!.next === list.head;
                })
            );
        });

        it('[Property] single element: head equals last', () => {
            fc.assert(
                fc.property(fc.integer(), (value) => {
                    const list = new Circular<number>();
                    list.append(value);
                    return list.head === list.last;
                })
            );
        });
    });
});

describe('Circular Singly Linked List - Multiple Elements', () => {
    describe('append multiple elements', () => {
        const multipleAppendTestCases = [
            {values: [1, 2], description: 'two elements'},
            {values: [5, 10, 15], description: 'three elements'},
            {values: [0, -1, -2, -3], description: 'four elements with negatives'},
        ];

        multipleAppendTestCases.forEach(({values, description}) => {
            it(`should append ${description}: ${values.join(', ')}`, () => {
                const list = new Circular<number>();
                list.append(...values);

                expect(list.head!.value).toBe(values[0]);
                expect(list.last!.value).toBe(values[values.length - 1]);
                expect(list.length).toBe(values.length);
                expect(list.toArray()).toEqual(values);
            });

            it(`${description} maintains circular structure: last.next === head`, () => {
                const list = new Circular<number>();
                list.append(...values);
                expect(list.node(list.length - 1).next).toBe(list.head);
            });

            it(`${description} forEach doesn't loop infinitely`, () => {
                const list = new Circular<number>();
                list.append(...values);

                const results: number[] = [];
                list.forEach((x) => results.push(x));

                expect(results).toEqual(values);
                expect(results.length).toBe(values.length);
            });
        });

        it('[Property] multiple appends match input array', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1}), (values) => {
                    const list = new Circular<number>();
                    list.append(...values);
                    return JSON.stringify(list.toArray()) === JSON.stringify(values);
                })
            );
        });

        it('[Property] circular: last.next always equals head', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 10}), (values) => {
                    const list = new Circular<number>();
                    list.append(...values);
                    return list.node(list.length - 1).next === list.head;
                })
            );
        });

        it('[Property] forEach on circular visits each element exactly once', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 10}), (values) => {
                    const list = new Circular<number>();
                    list.append(...values);

                    const visited: number[] = [];
                    list.forEach((x) => visited.push(x));

                    return JSON.stringify(visited) === JSON.stringify(values);
                })
            );
        });
    });

    describe('access various indices', () => {
        const accessTestCases = [
            {values: [10, 20, 30], indices: [0, 1, 2]},
            {values: [5, 15, 25, 35], indices: [0, 3]},
        ];

        accessTestCases.forEach(({values, indices}) => {
            it(`should access indices [${indices.join(', ')}] in [${values.join(', ')}]`, () => {
                const list = new Circular<number>();
                list.append(...values);

                indices.forEach((index) => {
                    expect(list.get(index)).toBe(values[index]);
                });
            });
        });

        it('[Property] circular get at valid index returns correct value', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 10}), (values) => {
                    const list = new Circular<number>();
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
        ];

        removeTestCases.forEach(({values, removeIndex, expected}) => {
            it(`should remove index ${removeIndex} from [${values.join(', ')}]`, () => {
                const list = new Circular<number>();
                list.append(...values);
                list.remove(removeIndex);
                expect(list.toArray()).toEqual(expected);
            });

            it(`after removing index ${removeIndex}, circular structure maintained`, () => {
                const list = new Circular<number>();
                list.append(...values);
                list.remove(removeIndex);

                if (list.length > 0) {
                    expect(list.node(list.length - 1).next).toBe(list.head);
                }
            });
        });

        it('[Property] circular: after remove, last.next still equals head', () => {
            fc.assert(
                fc.property(
                    fc.tuple(
                        fc.array(fc.integer(), {minLength: 1, maxLength: 10}),
                        fc.integer()
                    ),
                    ([values, _]) => {
                        const list = new Circular<number>();
                        list.append(...values);

                        if (list.length === 0) return true;

                        const removeIndex = Math.abs(_) % list.length;
                        list.remove(removeIndex);

                        if (list.isEmpty()) return true;
                        return list.node(list.length - 1).next === list.head;
                    }
                )
            );
        });
    });

    describe('search operations', () => {
        const searchTestCases = [
            {values: [1, 2, 3, 4, 5], searchValue: 3, expectedIndex: 2},
            {values: [10, 20, 30], searchValue: 10, expectedIndex: 0},
            {values: [1, 2, 3], searchValue: 99, expectedIndex: -1},
        ];

        searchTestCases.forEach(({values, searchValue, expectedIndex}) => {
            it(`should find ${searchValue} in circular [${values.join(', ')}] at index ${expectedIndex}`, () => {
                const list = new Circular<number>();
                list.append(...values);

                expect(list.indexOf(searchValue)).toBe(expectedIndex);
                if (expectedIndex >= 0) {
                    expect(list.includes(searchValue)).toBe(true);
                } else {
                    expect(list.includes(searchValue)).toBe(false);
                }
            });
        });

        it('[Property] circular indexOf doesn\'t infinite loop', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.integer(), {minLength: 1, maxLength: 10}),
                    (values) => {
                        const list = new Circular<number>();
                        list.append(...values);

                        const searchValue = values[0] + 1000;
                        const result = list.indexOf(searchValue);

                        return result === -1;
                    }
                )
            );
        });

        it('[Property] circular includes doesn\'t infinite loop', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.integer(), {minLength: 1, maxLength: 10}),
                    (values) => {
                        const list = new Circular<number>();
                        list.append(...values);

                        const searchValue = values[0] + 1000;
                        const result = list.includes(searchValue);

                        return result === false;
                    }
                )
            );
        });
    });

    describe('transformation operations', () => {
        const transformTestCases = [
            {values: [1, 2, 3], mapper: (x: number) => x * 2, expected: [2, 4, 6]},
            {values: [5, 10], mapper: (x: number) => x / 5, expected: [1, 2]},
        ];

        transformTestCases.forEach(({values, mapper, expected}) => {
            it(`should map [${values.join(', ')}] to [${expected.join(', ')}]`, () => {
                const list = new Circular<number>();
                list.append(...values);
                const mapped = list.map(mapper);
                expect(mapped.toArray()).toEqual(expected);
            });

            it(`mapped result is also circular with last.next === head`, () => {
                const list = new Circular<number>();
                list.append(...values);
                const mapped = list.map(mapper);

                if (mapped.length > 0) {
                    expect(mapped.node(mapped.length - 1).next).toBe(mapped.head);
                }
            });
        });

        it('[Property] map preserves length and circularity', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1}), (values) => {
                    const list = new Circular<number>();
                    list.append(...values);
                    const mapped = list.map((x) => x * 2);

                    const lengthPreserved = mapped.length === list.length;
                    const circularPreserved = mapped.node(mapped.length - 1).next === mapped.head;

                    return lengthPreserved && circularPreserved;
                })
            );
        });

        it('[Property] reverse maintains circularity', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 10}), (values) => {
                    const list = new Circular<number>();
                    list.append(...values);
                    const reversed = list.reverse();

                    if (reversed.isEmpty()) return true;
                    return reversed.node(reversed.length - 1).next === reversed.head;
                })
            );
        });

        it('[Property] reverse produces correct order', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 10}), (values) => {
                    const list = new Circular<number>();
                    list.append(...values);
                    const reversed = list.reverse();
                    return JSON.stringify(reversed.toArray()) === JSON.stringify([...values].reverse());
                })
            );
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
                values: [10, 20, 30],
                predicate: (x: number) => x > 15,
                expected: [20, 30],
            },
        ];

        filterTestCases.forEach(({values, predicate, expected}) => {
            it(`should filter [${values.join(', ')}] to [${expected.join(', ')}]`, () => {
                const list = new Circular<number>();
                list.append(...values);
                const filtered = list.filter(predicate);
                expect(filtered.toArray()).toEqual(expected);
            });

            it(`filtered result maintains circularity if not empty`, () => {
                const list = new Circular<number>();
                list.append(...values);
                const filtered = list.filter(predicate);

                if (filtered.length > 0) {
                    expect(filtered.node(filtered.length - 1).next).toBe(filtered.head);
                }
            });
        });

        it('[Property] filter maintains circularity', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1}), (values) => {
                    const list = new Circular<number>();
                    list.append(...values);
                    const filtered = list.filter((x) => x > 0);

                    if (filtered.isEmpty()) return true;
                    return filtered.node(filtered.length - 1).next === filtered.head;
                })
            );
        });
    });

    describe('reduce operations', () => {
        const reduceTestCases = [
            {values: [1, 2, 3], reducer: (a: number, b: number) => a + b, init: 0, expected: 6},
            {values: [2, 3, 4], reducer: (a: number, b: number) => a * b, init: 1, expected: 24},
        ];

        reduceTestCases.forEach(({values, reducer, init, expected}) => {
            it(`should reduce [${values.join(', ')}] to ${expected}`, () => {
                const list = new Circular<number>();
                list.append(...values);
                expect(list.reduce(reducer, init)).toBe(expected);
            });
        });

        it('[Property] circular reduce visits each element exactly once', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 10}), (values) => {
                    const list = new Circular<number>();
                    list.append(...values);

                    let visitCount = 0;
                    list.reduce((acc, x) => {
                        visitCount++;
                        return acc + x;
                    }, 0);

                    return visitCount === values.length;
                })
            );
        });
    });

    describe('join operations', () => {
        const joinTestCases = [
            {values: [1, 2, 3], separator: ',', expected: '1,2,3'},
            {values: [10, 20], separator: '-', expected: '10-20'},
        ];

        joinTestCases.forEach(({values, separator, expected}) => {
            it(`should join [${values.join(', ')}] with '${separator}'`, () => {
                const list = new Circular<number>();
                list.append(...values);
                expect(list.join(separator)).toBe(expected);
            });
        });

        it('circular join used default delimiter when one is not provided', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 5}), (values) => {
                    const list = new Circular<number>();
                    list.append(...values);
                    const joined = list.join();

                    return typeof joined === 'string' && joined.length > 0 && joined.split(',').length === values.length;
                })
            );
        });

        it('[Property] circular join doesn\'t infinite loop', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1, maxLength: 5}), (values) => {
                    const list = new Circular<number>();
                    list.append(...values);
                    const joined = list.join(',');

                    return typeof joined === 'string' && joined.length > 0;
                })
            );
        });
    });

    describe('prepend operations', () => {
        const prependTestCases = [
            {initial: [1, 2], prepend: [3, 4]},
            {initial: [5], prepend: [10, 15]},
        ];

        prependTestCases.forEach(({initial, prepend}) => {
            it(`should prepend [${prepend.join(', ')}] to [${initial.join(', ')}]`, () => {
                const list = new Circular<number>();
                list.append(...initial);
                list.prepend(...prepend);

                const expected = [...prepend.reverse(), ...initial];
                expect(list.toArray()).toEqual(expected);
            });

            it('after prepend, circular structure maintained', () => {
                const list = new Circular<number>();
                list.append(...initial);
                list.prepend(...prepend);

                expect(list.node(list.length - 1).next).toBe(list.head);
            });
        });
    });

    describe('insert operations', () => {
        const insertTestCases = [
            {values: [1, 2], insertValue: 10, insertIndex: 0},
            {values: [1, 2], insertValue: 10, insertIndex: 1},
            {values: [1, 2], insertValue: 10, insertIndex: 2},
        ];

        insertTestCases.forEach(({values, insertValue, insertIndex}) => {
            it(`should insert ${insertValue} at index ${insertIndex}`, () => {
                const list = new Circular<number>();
                list.append(...values);
                list.insert({value: insertValue, index: insertIndex});

                expect(list.length).toBe(values.length + 1);
            });

            it('after insert, circular structure maintained', () => {
                const list = new Circular<number>();
                list.append(...values);
                list.insert({value: insertValue, index: insertIndex});

                expect(list.node(list.length - 1).next).toBe(list.head);
            });
        });
    });

    describe('conversion to linear', () => {
        const conversionTestCases = [
            [1, 2, 3],
            [5, 10],
            [42],
        ];

        conversionTestCases.forEach((values) => {
            it(`should convert [${values.join(', ')}] to linear`, () => {
                const circular = new Circular<number>();
                circular.append(...values);
                const linear = circular.toLinear();

                expect(linear.toArray()).toEqual(values);
                expect(linear.last!.next).toBeNull();
            });
        });

        it('[Property] converted linear breaks circular reference', () => {
            fc.assert(
                fc.property(fc.array(fc.integer(), {minLength: 1}), (values) => {
                    const circular = new Circular<number>();
                    circular.append(...values);
                    const linear = circular.toLinear();

                    if (linear.last) {
                        return linear.last.next === null;
                    }

                    return false;
                })
            );
        });
    });
});
