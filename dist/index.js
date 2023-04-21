function testValue(value1, value2) {
    if ((typeof value1) !== (typeof value2))
        return true;
    if (Number.isNaN(value1) || Number.isNaN(value2))
        return Number.isNaN(value1) !== Number.isNaN(value2);
    if ((value1 !== value2))
        return true;
    return false;
}
/**
 * Returns true if input1 differs in any way from input2. Performs "deep" object/array traversal by default, comparing all reachable values.
 * @param {any} input1 A value/object to compare against input2.
 * @param {any} input2 A value/object to compare against input1.
 * @param {boolean} [deep=true] Set this operand to false to disable traversal and nested comparisons.
 */
export default function testDiff(obj1, obj2, deep) {
    if (deep === void 0) { deep = true; }
    if ((obj1 === null) || (obj2 === null) || ((typeof obj1) !== "object") || ((typeof obj2) !== "object"))
        return testValue(obj1, obj2);
    var stack = [{ obj1: obj1, obj2: obj2 }];
    var seen = new Map();
    seen.set(obj1, stack[0]);
    var _loop_1 = function () {
        var objects = stack.pop();
        if (Array.isArray(objects.obj1) !== Array.isArray(objects.obj2))
            return { value: true };
        var props1 = Object.keys(objects.obj1);
        var props2 = Object.keys(objects.obj2);
        if (props1.length === 0 && props2.length === 0)
            return "continue";
        if (props1.length !== props2.length)
            return { value: true };
        if (!props1.every(function (value) { return props2.includes(value); }))
            return { value: true };
        if (!props2.every(function (value) { return props1.includes(value); }))
            return { value: true };
        _props: for (var loc = 0; loc < props1.length; loc++) {
            var prop = props1[loc];
            var value1 = objects.obj1[prop];
            var value2 = objects.obj2[prop];
            if ((typeof value1) !== (typeof value2))
                return { value: true };
            if (value1 === null || value2 === null || ((typeof value1) !== "object") || ((typeof value2) !== "object")) {
                if (testValue(value1, value2))
                    return { value: true };
                continue _props;
            }
            if (value1 instanceof RegExp && value2 instanceof RegExp) {
                if (value1.source !== value2.source
                    || value1.ignoreCase !== value2.ignoreCase
                    || value1.global !== value2.global
                    || value1.multiline !== value2.multiline
                    || value1.sticky !== value2.sticky
                    || value1.unicode !== value2.unicode
                    || value1.flags !== value2.flags) {
                    return { value: true };
                }
                continue _props;
            }
            if (seen.has(value1))
                continue _props;
            if (deep)
                stack.push({ obj1: value1, obj2: value2 });
            seen.set(value1, objects);
        }
        if (!deep)
            return { value: false };
    };
    _objects: while (stack.length !== 0) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
}
