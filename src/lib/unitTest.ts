// Low budget unit tests instead of Jasmine or Chai
// Isolates between invocations. Safely contains everything that can go wrong.
export function unitTest (description:string, testFunction:Function):void {
	const testLog:Array<string> = [`Test run: ${description}:`];
	const expectQueue:Array<Function> = [];
	class Expectation {
		actualValue;
		constructor(anyValue: any) {
			this.actualValue = anyValue;
			return this;
		}
		toBe(expectedValue: any) {
			expectQueue.push(():void => {
				if(expectedValue !== this.actualValue)
					throw new Error(`Expected ${expectedValue} but received ${this.actualValue} instead.`);
			});
		}
	}
	function expect(anyValue: any):Expectation {
		return new Expectation(anyValue);
	}
	let caughtError = false;
	try {
		testFunction(expect);
		if(expectQueue.length === 0) {
			testLog.push("	❓ Test FAIL: No expectations were defined for this test.");
			process.exitCode = 1;
			caughtError = true;
		}
	} catch (error) {
		testLog.push(`	❌ Test FAIL: ${error.toString()}`);
		process.exitCode = 1;
		caughtError = true;
	}
	for(const exp of expectQueue) {
		try {
			exp();
		} catch (error) {
			testLog.push(`	❌ Expectation FAIL: ${error.toString()}`);
			process.exitCode = 1;
			caughtError = true;
		}
	}
	if(!caughtError)
		testLog.push("	🟢 Test OK!");
	console.log(testLog.join("\n"));
}