"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitTest = void 0;
// Low budget unit tests instead of Jasmine or Chai
// Isolates between invocations. Safely contains everything that can go wrong.
function unitTest(description, testFunction) {
    var testLog = ["Test run: ".concat(description, ":")];
    var expectQueue = [];
    var Expectation = /** @class */ (function () {
        function Expectation(anyValue) {
            this.actualValue = anyValue;
            return this;
        }
        Expectation.prototype.toBe = function (expectedValue) {
            var _this = this;
            expectQueue.push(function () {
                if (expectedValue !== _this.actualValue)
                    throw new Error("Expected ".concat(expectedValue, " but received ").concat(_this.actualValue, " instead."));
            });
        };
        return Expectation;
    }());
    function expect(anyValue) {
        return new Expectation(anyValue);
    }
    var caughtError = false;
    try {
        testFunction(expect);
        if (expectQueue.length === 0) {
            testLog.push("	❓ Test FAIL: No expectations were defined for this test.");
            process.exitCode = 1;
            caughtError = true;
        }
    }
    catch (error) {
        testLog.push("\t\u274C Test FAIL: ".concat(error.toString()));
        process.exitCode = 1;
        caughtError = true;
    }
    for (var _i = 0, expectQueue_1 = expectQueue; _i < expectQueue_1.length; _i++) {
        var exp = expectQueue_1[_i];
        try {
            exp();
        }
        catch (error) {
            testLog.push("\t\u274C Expectation FAIL: ".concat(error.toString()));
            process.exitCode = 1;
            caughtError = true;
        }
    }
    if (!caughtError)
        testLog.push("	🟢 Test OK!");
    console.log(testLog.join("\n"));
}
exports.unitTest = unitTest;
