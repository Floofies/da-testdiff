import { testDiff } from "./dist/index.js";
import { unitTest } from "./dist/lib/unitTest.js";
// Generic "user data" test object which contains a broad variety of object structures and data types.
function createTestObject() {
	return [
		{
			"id": 1,
			"name": "Leanne Graham",
			"username": "Bret",
			"email": "Sincere@april.biz",
			"regex": new RegExp("^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$"),
			"address": {
				"street": "Kulas Light",
				"suite": "Apt. 556",
				"city": "Gwenborough",
				"zipcode": 92998,
				"geo": {
					"lat": -37.3159,
					"lng": 81.1496
				}
			},
			"website": null,
			"company": {
				"active": false,
				"name": "Romaguera-Crona",
				"catchPhrase": "Multi-layered client-server neural-net",
				"bs": "harness real-time e-markets"
			}
		},
		{
			"id": 2,
			"name": "Ervin Howell",
			"username": "Antonette",
			"email": "Shanna@melissa.tv",
			"regex": new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$"),
			"address": {
				"street": "Victor Plains",
				"suite": "Suite 879",
				"city": "Wisokyburgh",
				"zipcode": 90566,
				"geo": {
					"lat": -43.9509,
					"lng": -34.4618
				}
			},
			"website": null,
			"company": {
				"active": true,
				"name": "Deckow-Crist",
				"catchPhrase": "Proactive didactic contingency",
				"bs": "synergize scalable supply-chains"
			}
		}
	];
}
const testObjects = {};
testObjects["Multidimensional Acyclic"] = () => createTestObject();
testObjects["Linear Acyclic"] = () => ["one", "two", "three"];
// Fourth element is a cycle
testObjects["Linear Cyclic"] = () => {
	const obj = ["one", "two", "three"];
	obj[3] = obj;
	return obj;
};
// Nested Arrays
testObjects["Nested Acyclic"] = () => ["one", "two", [
	"three", "four", [
		"five", "six"
	]
]];
testObjects["Nested Cyclic"] = () => {
	const obj = ["one", "two", [
		"three", "four", [
			"five", "six"
		]
	]];
	obj[2].push(obj[2][2]);
	return obj;
};
// `otherUser` properties are a cycle
testObjects["Multidimensional Cyclic"] = () => {
	const obj = createTestObject();
	obj[0].otherUser = obj[1];
	obj[1].otherUser = obj[0];
	return obj;
}
// Useful for mapping shortest path
testObjects["Multipath"] = () => ({
	path1: {
		path12: {
			path13: [0, 1, 2, 3, 4]
		}
	},
	path2: {
		path22: [0, 1, 2, 3, 4]
	}
});
// Useful for mapping multiple paths to the same value
testObjects["Multireference"] = () => {
	const obj = {
		path1: {
			path12: {
				path13: [0, 1, 2, 3, 4]
			}
		},
		path2: {
			path22: "Hello!"
		}
	}
	obj.path1.path12.path13[5] = obj.path2.path22;
	return obj;
};

console.log("💫 Starting js-testdiff unit tests:")
// Fun Fact: Opossums groom themselves and are quite clean.
unitTest("should return true when two objects differ", function (expect) {
	const testObject = testObjects["Nested Acyclic"]();
	testObject[2][2][0] = "This difference should be detected.";
	expect(testDiff(testObject, testObjects["Nested Acyclic"]())).toBe(true);
	expect(testDiff(testObjects["Linear Acyclic"](), testObjects["Linear Cyclic"]())).toBe(true);
	expect(testDiff(testObjects["Multidimensional Cyclic"](), testObjects["Multidimensional Acyclic"]())).toBe(true);
	expect(testDiff(testObjects["Linear Cyclic"](), testObjects["Multidimensional Acyclic"]())).toBe(true);
	expect(testDiff(testObjects["Nested Cyclic"](), testObjects["Nested Acyclic"]())).toBe(true);
});
unitTest("should return false when two objects are the same", function (expect) {
	expect(testDiff(testObjects["Linear Acyclic"](), testObjects["Linear Acyclic"]())).toBe(false);
	expect(testDiff(testObjects["Linear Cyclic"](), testObjects["Linear Cyclic"]())).toBe(false);
	expect(testDiff(testObjects["Multidimensional Acyclic"](), testObjects["Multidimensional Acyclic"]())).toBe(false);
	expect(testDiff(testObjects["Multidimensional Cyclic"](), testObjects["Multidimensional Cyclic"]())).toBe(false);
	expect(testDiff(testObjects["Nested Cyclic"](), testObjects["Nested Cyclic"]())).toBe(false);
	expect(testDiff(testObjects["Nested Acyclic"](), testObjects["Nested Acyclic"]())).toBe(false);
});
unitTest("should ignore deep differences when traversal is disabled", function (expect) {
	const testObject = testObjects["Nested Acyclic"]();
	testObject[2][2][0] = "This difference should NOT be detected.";
	expect(testDiff(testObject, testObjects["Nested Acyclic"](), false)).toBe(false);
});