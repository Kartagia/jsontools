/**
 * The developer generated JUNIT test for the JSON converter.
 */

import { expect } from "chai";
import { describe, it } from "mocha";
import { JSONConverter } from "../modules/jsonconverter.mjs";



describe("JUnit test for module jsonconverter", () => {
  describe("Construction", () => {

  });
  describe("Default conversion", () => {
    const converter = new JSONConverter();
    describe("Default stringification", () => {
      const testFunc = (tested) => (converter.stringify(tested));

      it("boolean", () => {
        getValidBooleanValues().forEach((tested) => {
          let result;
          expect(() => { result = testFunc(tested) }).to.not.throw();
          expect(result).string;
          expect(result).equals(JSON.stringify(tested));
        });
      });
      it("Date", () => {
        getValidTestDates().forEach((tested) => {
          let result;
          expect(() => { result = testFunc(tested) }).to.not.throw();
          expect(result).string;
          expect(result).equals(JSON.stringify(tested));
        });
      });
      it("number", () => {
        getValidTestNumbers().forEach((tested) => {
          let result;
          expect(() => { result = testFunc(tested) }).to.not.throw();
          expect(result).string;
          expect(result).equals(JSON.stringify(tested));
        });

      });
      it("bigint", () => {
        getValidTestBigIntegers()
          .forEach((tested) => {
            let result;
            expect(() => { result = testFunc(tested) }).to.throw();
            expect(() => { result = testFunc(tested) }).to.throw("Do not know how to serialize a BigInt");
          });
      });
      it("string", () => {
        getValidTestStringValues()
          .forEach((tested) => {
            let result;
            expect(() => { result = testFunc(tested) }).to.not.throw();
            expect(result).string;
            expect(result).equals(JSON.stringify(tested));
          });
      }).skip;
      it("null", () => {
        getValidTestNullValue()
          .forEach((tested) => {
            let result;
            expect(() => { result = testFunc(tested) }).to.not.throw();
            expect(result).string;
            expect(result).equals(JSON.stringify(tested));
          });
      }).skip;
      it("undefined", () => {
        getValidTestUndefinedValue()
          .forEach((tested) => {
            let result;
            expect(() => { result = testFunc(tested) }).to.not.throw();
            expect(result).string;
            expect(result).equals(JSON.stringify(tested));
          });
      });
      it("function", () => {
        getValidTestFunctionValues()
          .forEach((tested) => {
            let result;
            expect(() => { result = testFunc(tested) }).to.not.throw();
            expect(result).string;
            expect(result).equals(JSON.stringify(tested));
          });
      });
      it("array", () => {
        getValidTestArrays()
          .forEach((tested) => {
            let result;
            expect(() => { result = testFunc(tested) }).to.not.throw();
            expect(result).string;
            expect(result).deep.equals(JSON.stringify(tested));
          });
      });
      it("object", () => {
        getValidTestObjects()
          .forEach((tested) => {
            let result;
            expect(() => { result = testFunc(tested) }).to.not.throw();
            expect(result).string;
            expect(result).equals(JSON.stringify(tested));
          });

      });
      it("Map", () => {
        getValidTestMapValues()
          .forEach((tested) => {
            let result;
            expect(() => { result = testFunc(tested) }).to.not.throw();
            expect(result).string;
            expect(result).equals(JSON.stringify(tested));
          });
      });

    });
    describe("Default parsing", () => {
      const testFunc = (tested) => (converter.parse(tested));
      it("boolean", () => {
        const testCases = createParseCases(getValidBooleanValues());
        testParseTestCases(testCases, testFunc);
      });
      it("Date", () => {
        const testCases = createParseCases(getValidTestDates());
        testParseTestCases(testCases, testFunc);
      });
      it("number with testParseTestCases", () => {
        const testCases = createParseCases(getValidTestNumbers(), undefined, equalNumber);
        testParseTestCases(testCases, testFunc, equalNumber);
      });
      it("number", () => {
        const testCases = getValidNumberParseCases();
        getValidBooleanParseCases().forEach((testCase, index) => {
          let result;
          if (testCase.exception) {
            expect(() => { result = converter.parse(testCase.source); },
              `Test Case: #${index}: ${testCase} did not fail`).to.throw((testCase.exception instanceof Error ? testCase.exception.message : testCase.exception));
          } else {
            expect(() => { result = converter.parse(testCase.source); }, `Test Case #${index}: ${testCase}: throwed on exception`).to.not.throw();
            expect(result).equals(testCase.result);
          }
        });

      });
      it.skip("bigint", () => {

      });
      it.skip("string", () => {

      });
      it.skip("null", () => {

      });
      it.skip("function", () => {

      });
      it.skip("array", () => {

      });
      it.skip("object", () => {

      });
      it.skip("Map", () => {
      });

    });
  });
});

function testErrorMessage(testCase, actualResult, index) {
  if (testCase == null) {
    return `Test Case #${index}: Undefined test case`;
  } else if (testCase.exception) {
    return `Test Case #${index}: Source ${testCase.source} => ${actualResult} instead of exception ${testCase.exception}`;
  } else if (testCase.failure) {
    return `Test Case #${index}: Source ${testCase.source} => ${actualResult} instead of expected failure`;
  } else {
    return `Test Case #${index}: Source ${testCase.source} => ${actualResult} instead of ${testCase.result}`;
  }
}

/**
 * Testing parse cases.
 * @param {Array<TestCase<*>>} testCases The teste cases. 
 * @param {Function} testFunc The tested function, whose result with source is compared to the result of the test case.
 * @throws {Error} The assertion failed.
 */
function testParseTestCases(testCases, testFunc) {
  testCases.forEach((testCase, index) => {
    let result;
    if (testCase.exception) {
      // Expecting an exception.
      expect(() => { result = testFunc(testCase.source); },
        testErrorMessage(testCase, result, index)
      ).to.throw(testCase.exception);
    } else {
      // Expecting a result.
      expect(() => { result = testFunc(testCase.source); },
        testErrorMessage(testCase, result, index)
      ).to.not.throw();
      result = testFunc(testCase.source);
      console.log("Index: ", index, ", Source: ", testCase.source, ", Result: ", result, ", Tester: ", testFunc.toString(),
        "\n Eqauality: ", testCase.equality, ", Exception: ", testCase.exception, ", Failure: ", testCase.failure);
      if (testCase.equality) {
        expect((testCase.equality(result, testCase.result) == (testCase.failure ? false : true)),
          testErrorMessage(testCase, result, index)
        ).to.be.true;
      } else {
        if (testCase.failure) {
          expect(result, testErrorMessage(testCase, result, index)
          ).to.not.equal(testCase.result);
        } else {
          expect(result, testErrorMessage(testCase, result, index)
          ).to.equal(testCase.result);
        }
      }
    }
  });
  return true;
}

/**
 * A parse case reprenting a single case of parse.
 * @typedef {object} ParseCase
 * @template TYPE
 * @property {string} [source] The parsed value.
 * @property {TYPE} [result] The result of the parse.
 * @property {boolean} [failed=false] Is the parse failure.
 * @property {string} [exception] The exception message thrown by the parse.
 * @property {Function} [equality] The equality comparison function. Defaulst to the
 * strict equality of the operator ===. 
 */

/**
 * The equality function.
 * @callback Equality 
 * @template A, [B=A]
 * @param {A} first The first value compared.
 * @param {B} second The second value compared.
 * @returns {boolean} True, if and only if the first and second are equals.
 */

/**
 * @typedef {object} Stringifier 
 * @property {Function} stringify The stringifier function converting a value to string.
 */

/**
 * @typedef {object} Parser 
 * @template [TYPE=*]
 * @property {Function} parse The function parsing a string into type.
 */

/**
 * Creates parse test cases.
 * @template TYPE
 * @param {Array<TYPE>} sourceValues The source values, from which the test cases are created.
 * @param {JSONConverter|JSON} [stringifier=JSON] The object performing the stringification.
 * @param {Equality<TYPE>} [equality] THe function used to determine value equality. 
 * Defaults to the "===" equality.
 * @returns {Array<TestCase<TYPE>>?} The array of created test cases, or an undefined value if the
 * soruce values was invalid.
 */
function createParseCases(sourceValues, stringifier = JSON, equality = basicEquals) {
  if (sourceValues instanceof Array) {
    return sourceValues.map((source, _index) => {
      const result = { result: source, equality: equality };
      try {
        const parsed = stringifier.stringify(source);
        result.source = parsed;
        result.failure = typeof parsed !== "string" || !equality(stringifier.parse(parsed), source)
      } catch (error) {
        result.error = error;
      }
      return result;
    })
  } else {
    return undefined;
  }
}

/**
 * Basic equality testing.
 * @param {*} a The first value.
 * @param {*} b The second value.
 * @returns {boolean} The result.
 */
function basicEquals(a, b) {
  return a === b;
}

describe("equalNumbers", () => {
  it("Valid integers", () => {
    const allTested = getValidTestIntegers();
    allTested.forEach((tested, index) => {
      expect(equalNumber(tested, tested), `Test Case #${index}: ${tested} equal with itself`).to.be.true;
    });
  });

  it("Valid dacimals", () => {
    const allTested = getValidTestDecimals();
    allTested.forEach((tested, index) => {
      expect(equalNumber(tested, tested), `Test Case #${index}: ${tested} equal with itself`).to.be.true;
    });
  });
  it("Valid boolean", () => {
    const allTested = getValidBooleanValues();
    allTested.forEach((tested, index) => {
      expect(equalNumber(tested, tested), `Test Case #${index}: ${tested} equal with itself`).to.be.false;
    });
  });
});

describe("basicEquals test", () => {
  it("Dates", () => {
    const allTested = getValidTestDates();
    allTested.forEach(
      (tested, index, all) => {
        allTested.forEach((testee, index2) => {
          expect(basicEquals(tested, testee), `Test Case #${index}.${index2}: ${tested} === ${testee} != ${tested === testee}`).to.equal(tested === testee);
        }
        );
      }
    )
  });
  it("Numbers", () => {
    const allTested = getValidTestNumbers();
    allTested.forEach(
      (tested, index) => {
        allTested.forEach((testee, index2) => {
          expect(basicEquals(tested, testee), `Test Case #${index}.${index2}: ${tested} === ${testee} != ${tested === testee}`).to.equal(tested === testee);
        }
        );
      }
    )
  });
});


/**
 * Get the parse cases of the valid test integers.
 * @param {Stringifier} [stringifier=JSON] The object performing the stringification.
 * @returns {Array<ParseCase<number>>} 
 */
function getIntegerParseCases(stringifier = undefined) {
  return createParseCases(getValidTestIntegers(), stringifier, equalNumber());
}

/**
 * Determines if the given values are equal numbers.
 * @param {*} a The first value.
 * @param {*} b The second value.
 * @returns {boolean} True, if and only if the given a and b are equal numbers.
 */
function equalNumber(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    return false;
  } else if (Number.isNaN(a) || Number.isNaN(b)) {
    // NaN is special case we have to deal separately as NaN !== NaN.
    return Number.isNaN(a) && Number.isNaN(b);
  } else {
    // The rest of numbers can be dealed with equality.
    return a === b;
  }
}

/**
 * Get the list of the decimal parse cases.
 * @param {Stringifier} [stringifier=JSON] The object performing the stringification.
 * @returns {Array<ParseCase<number>>} The list of decimal parse cases.
 */
function getDecimalParseCases(stringifier = JSON) {
  return createParseCases(getValidTestDecimals(), stringifier, equalNumber);
}

/**
 * Get the list of the passed decimal parse cases.
 * @param {Stringifier} [stringifier=JSON] The object performing the stringification.
 * @returns {Array<ParseCase<number>>} The list of the valid parse cases.
 */
function getValidDecimalParseCases(stringifier = JSON) {
  return getDecimalParseCases(stringifier).filter((testCase) => (!(testCase.failure || testCase.exception)));
}

/**
 * Get the list of the failed decimal parse cases.
 * @param {Stringifier} [stringifier=JSON] The object performing the stringification.
 * @returns {Array<ParseCase<number>>} The list of the invalid parse cases.
 */
function getInvalidDecimalParseCases(stringifier = JSON) {
  return getDecimalParseCases(stringifier).filter((testCase) => (testCase.failure));
}

/**
 * Get the list of the valid number parse cases.
 * @param {Stringifier} [stringifier=JSON] The object performing the stringification.
 * @returns {Array<ParseCase<number>>} The list of the valid parse cases.
 */
function getValidNumberParseCases(stringifier = JSON) {
  return [...getIntegerParseCases(stringifier), ...getValidDecimalParseCases()]
}

/**
 * Get the list of the valid  boolean parse cases.
 * @param {Stringifier} [stringifier=JSON] The object performing the stringification.
 * @returns {Array<ParseCase<boolean>>} The list of the valid parse cases.
 */
function getBooleanParseCases(stringifier = JSON) {
  return createParseCases(getValidBooleanValues(), stringifier);
}
/**
 * Get the list of the valid  boolean parse cases.
 * @param {Stringifier} [stringifier=JSON] The object performing the stringification.
 * @returns {Array<ParseCase<boolean>>} The list of the valid parse cases.
 */
function getValidBooleanParseCases(stringifier = JSON) {
  return getBooleanParseCases(stringifier).filter((testCase) => (!(testCase.failure)));
}

/**
 * Get the list of ivnalid boolean parse cases.
 * @param {Stringifier} [_stringifier = JSON] The ojbect perofmring the stringification. 
 * @returns {Array<TestCase<boolean>>} The list of invalid boolean test cases.
 */
function getInvalidBooleanParseCases(_stringifier = JSON) {
  return ["1", '""', "null", "0"].map(
    (value) => ({ source: value, failure: true }));
}

function getValidTestObjects() {
  return [{}, { a: "a", b: "c", c: "b" }, { _links: [{ rel: "self", href: "/TestData/TestResource/1" }], _embedded: [], id: "idvalue", name: "Test Resource" }];
}

function getValidTestMapValues() {
  return [new Map(), new Map([["a", "b"], ["ba", "cha"], [3, 5], [null, undefined], [undefined, null]])];
}

function getValidTestArrays() {
  return [...[[]], ...[[1, 2, 3, 4]], ...[["a", "b", "d", "e", "f"]], ...[[undefined, null, true, false, 0, -1, () => (true), "abbaDabba"]]];
}

function getValidTestNumbers() {
  return [...getValidTestIntegers(),
  ...getValidTestDecimals()];
}

function getValidTestBigIntegers() {
  return [1n, 0n, -1n, 2n ** 10n, BigInt(Number.MAX_SAFE_INTEGER), BigInt(Number.MIN_SAFE_INTEGER), BigInt(Number.MAX_SAFE_INTEGER) + 1n, BigInt(Number.MIN_SAFE_INTEGER) - 1n];
}

function getValidTestDecimals() {
  return [1.5, -1.5];
}

function getValidTestIntegers() {
  return [-1, 0, 1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
}

function getValidTestDates() {
  return [new Date(), new Date(Date.now()), new Date(2000, 1, 1), new Date(0),
  new Date("2022-01-02T01:02:03+03:00"),
  new Date("2022-01-02T01:02:03Z"),
  new Date("2022-01-01T23:01:59.999"),
  new Date("2022-01T22:00"),
  new Date("2022-01"),
  new Date("2022"),
  new Date("2022-01-01")];
}

function getValidBooleanValues() {
  return [true, false];
}

function getValidTestStringValues() {
  return ["", "Furball", " Barfur", "Darfur ", "1"];
}

function getValidTestNullValue() {
  return [null];
}

function getValidTestUndefinedValue() {
  return [undefined];
}

function getValidTestFunctionValues() {
  return [Object.toString, () => (true)];
}