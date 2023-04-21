# js-testDiff

- [About]("#about")
- [Building]("#building")
- [Syntax]("#syntax")
- [Usage Examples]("#usage-examples")

## About

Deep object diffing function for JavaScript; returns true if input 1 differs in any way from input 2. Original code was taken from Differentia.js and ported to TypeScript.

The testDiff function was originally created as a unit testing utility and it was primarily designed/used to test Differentia's search algorithm strategy system, setting a "gold standard" for that library's quality and algorithmic correctness.

The key difference with this version of testDiff is that I removed its "search index" functionality, as it introduced more complexity than it was worth.

Feel free to scavenge the original code as I have: https://github.com/Floofies/Differentia.js/blob/master/spec/testUtils.js

## Building

Run `npm run build` to compile and test module `dist/index.js`.

I have pre-compiled the most up-to-date files in `dist`. Enjoy.

`unitTest.js` can be safely ignored, as it's a development-only dependency for `test.mjs`.

## Syntax

```JavaScript
import { testDiff } from "testDiff";
```
```JavaScript
testDiff( input1:any, input2:any, [ deep:boolean = false ] );
```

### Parameters:

#### `input1`, `input2`

Two values/objects to compare against each other.

#### `deep` (_Optional_) (_Default = `true`_)

TestDiff performs "deep" object/array traversal by default, comparing all reachable values; set this operand to `false` to disable traversal and nested comparisons.

### Return Value:

Returns `true` if `input1`'s structure, properties, or values differ in any way from `input2`, or `false` if otherwsie.

## Usage Examples

### Example 1: Arbitrary values.

Can handle any arbitrary values, as well as objects/arrays.

```JavaScript
const myArray1 = "Hello World!";
const myArray2 = "This is a test";
const result = testDiff(myArray1, myArray2);
// result = true
```

### Example 2: Flat arrays/objects.

```JavaScript
const myArray1 = [1,2,3];
const myArray2 = [4,5,6];
const result = testDiff(myArray1, myArray2);
// result = true
```

### Example 3: Nested arrays/objects.

```JavaScript
const myArray1 = ["Hello",["World!"]];
const myArray2 = ["Hello",["Developer!"]];
const result = testDiff(myArray1, myArray2);
// result = true
```

### Example 4: Nested arrays. Traversal disabled.

In this example, the function returns `false` even though the arrays' contents differ; they are regarded as the same because there are no differences at the top, and disabling traversal prevents the algorithm from seeing deeper differences.

```JavaScript
const myArray1 = ["Hello",["World!"]];
const myArray2 = ["Hello",["Developer!"]];
const result = testDiff(myArray1, myArray2, false);
// result = false
```