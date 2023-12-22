/**
 * Returns true if input1 differs in any way from input2. Performs "deep" object/array traversal by default, comparing all reachable values.
 * @param {any} input1 A value/object to compare against input2.
 * @param {any} input2 A value/object to compare against input1.
 * @param {boolean} [deep=true] Set this operand to false to disable traversal and nested comparisons.
 */
export default function testDiff(input1:any|object|Array<any>, input2:any|object|Array<any>, deep?:boolean):boolean;