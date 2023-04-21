type searchObj = any|object|Array<any>;
type objPair = {obj1:searchObj, obj2: searchObj};
type Primitive = symbol|boolean|string|number|null|undefined;
function testValue(value1:Primitive, value2:Primitive):boolean {
	if ((typeof value1) !== (typeof value2))
		return true;
	if(Number.isNaN(value1) || Number.isNaN(value2))
		return Number.isNaN(value1) !== Number.isNaN(value2);
	if((value1 !== value2))
		return true;
	return false;
}
// Returns true if obj1 differs in any way from obj2.
export function testDiff(obj1:searchObj, obj2:searchObj, deep:boolean = true):boolean {
	if((obj1 === null) || (obj2 === null) || ((typeof obj1) !== "object") || ((typeof obj2) !== "object"))
		return testValue(obj1, obj2);
	const stack:Array<objPair> = [{ obj1: obj1, obj2: obj2 }];
	const seen:Map<searchObj, objPair> = new Map();
	seen.set(obj1, stack[0]);
	_objects: while (stack.length !== 0) {
		const objects:objPair = <objPair> stack.pop();
		if (Array.isArray(objects.obj1) !== Array.isArray(objects.obj2))
			return true;
		const props1 = Object.keys(objects.obj1);
		const props2 = Object.keys(objects.obj2);
		if (props1.length === 0 && props2.length === 0)
			continue;
		if (props1.length !== props2.length)
			return true;
		if (!props1.every(value => props2.includes(value)))
			return true;
		if (!props2.every(value => props1.includes(value)))
			return true;
		_props: for (var loc = 0; loc < props1.length; loc++) {
			const prop:string = props1[loc];
			const value1:any = objects.obj1[prop];
			const value2:any = objects.obj2[prop];
			if ((typeof value1) !== (typeof value2))
				return true;
			if (value1 === null || value2 === null || ((typeof value1) !== "object") || ((typeof value2) !== "object")) {
				if(testValue(value1, value2))
					return true;
				continue _props;
			}
			if (value1 instanceof RegExp && value2 instanceof RegExp) {
				if (
					value1.source !== value2.source
					|| value1.ignoreCase !== value2.ignoreCase
					|| value1.global !== value2.global
					|| value1.multiline !== value2.multiline
					|| value1.sticky !== value2.sticky
					|| value1.unicode !== value2.unicode
					|| value1.flags !== value2.flags
				) {
					return true;
				}
				continue _props;
			}
			if (seen.has(value1))
				continue _props;
                        if(deep)
				stack.push({ obj1: value1, obj2: value2 });
			seen.set(value1, objects);
		}
                if(!deep)
			return false;
	}
	return false;
}