"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitTest = void 0;
// Low budget unit tests instead of Jasmine or Chai
// Isolates between invocations. Safely contains everything that can go wrong.
function unitTest(description, testFunction) {
    var testLog = ["Test: ".concat(description, ":")];
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
                    throw new Error("Expected value \"".concat(expectedValue, "\" but received value \"").concat(_this.actualValue, "\" instead."));
            });
        };
        return Expectation;
    }());
    function expect(anyValue) {
        return new Expectation(anyValue);
    }
    var caughtError = false;
    var startTime = performance.now();
    var totalTime;
    try {
        testFunction(expect);
        totalTime = (performance.now() - startTime).toFixed(3);
        if (expectQueue.length === 0) {
            testLog.push("	❓ Tests FAILED: No expectations were defined.");
            process.exitCode = 1;
            caughtError = true;
        }
    }
    catch (error) {
        totalTime = (performance.now() - startTime).toFixed(3);
        testLog.push("\t\u274C Tests FAILED in ".concat(totalTime, "ms.: ").concat(error, "\n\t\t").concat(error.stack.replaceAll("    ", "		  ")));
        process.exitCode = 1;
        caughtError = true;
    }
    var totalExp = 0;
    for (var _i = 0, expectQueue_1 = expectQueue; _i < expectQueue_1.length; _i++) {
        var exp = expectQueue_1[_i];
        try {
            totalExp++;
            exp();
        }
        catch (error) {
            testLog.push("\t\u274C Tests FAILED in ".concat(totalTime, "ms.\n\t\u274C Expectation #").concat(totalExp, " FAIL: ").concat(error.toString()));
            process.exitCode = 1;
            caughtError = true;
        }
    }
    if (!caughtError)
        testLog.push("\t\uD83D\uDFE2 Tests PASSED in ".concat(totalTime, "ms."));
    console.log(testLog.join("\n") + "\n");
}
exports.unitTest = unitTest;
