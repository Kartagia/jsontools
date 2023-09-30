
/**
 * The module containing the JSON conveter object.
 * @module JSONConverter
 */

/**
 * Predicate tests a value.
 * @callback Predicate
 * @template TYPE
 * @param {TYPE} tested The tested value.
 * @returns {boolean} True, if and only if the tested fulfills the predicate.
 */

/**
 * The function replacing a value with its stringified JSON value.
 * @callback JSONReplacerFunction
 * @template TYPE
 * @param {string} key The key of the current property. The value "" indicates the root object is handled.
 * If the key is string of a number, it is the array index of the parsed value. Otherwise it is the parsed object property name.
 * @param {TYPE} value The stringified value.
 * @returns {JSONTypes|TYPE|undefined} The JSON type replacing the current value during stringification.
 * An undefined value would remove the value from JSON.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#the_replacer_parameter
 */

/**
 * The list of the properties should be included to the stringified JSON representation of an object.
 * @typedef {array<string|number>} JSONReplacerProperties
 */

/**
 * The function reviving the stringified value.
 * @callback JSONReviverFunction
 * @template TYPE
 * @param {string} key The key of the processed property. The value "" indicates the value is reviver is performing
 * final check before returing the parse result. If the key is string of a number, it is the array index of the parsed
 * value. Otherwise it is the parsed object property name.
 * @param {*} value The current parse result. If the key is "", the value is the JSON parse result of the parsed
 * string. Otherwiese the value is the JSON parse result of the key.
 * @returns {TYPE|*} If the reviver does not handle the given value, the value is returned. 
 * If the reviver removes the value from the result, an undefined value is returned.
 * If the reviver successfully parses the value, an instance of TYPE is returned.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#the_reviver_parameter
 */

/**
 * The replacer used for stringification.
 * @typedef {JSONReplacerFunction|JSONReplacerProperties} JSONReplacer 
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#the_replacer_parameter
 */

/**
 * Class representing a JSON converter wrapping both reviver and replacer into same object.
 * The class does also support chaining converters by using default converter.
 * @template TYPE
 */
export class JSONConverter {

  /**
   * Default validator of the JSON strings. If the value is a string, then a JSON parse is performed
   * for it, and if it succeeds, the string is considered a valid JSON.
   * @type {Predicate<string>}
   */
  static validJSON(json) {
    switch (typeof json) {
      case "string":
        try {
          JSON.parse(json);
          return true;
        } catch (error) {
          return false;
        }
      default:
        return false;
    }
  }

  /**
   * The default predicate testing the validity of the stringified value.
   * @type {Predicate<*>}  
   */
  static validSource(value) {
    return true;
  }

  /**
   * The JSON validator function.
   */
  #jsonValidate = static.validJSON;

  /**
   * The validator validating value for this converter.
   */
  #validator = static.validSource;

  /**
   * The JSON reviver used to revive valid values.
   * @type {JSONReviver}
   * @default undefined The property is by default undefined.
   */
  #reviver;

  /**
   * The JSON replacer used to replace valid values.
   * @type {JSONReplacer}
   * @default undefined The property is by default undefined.
   */
  #replacer;

  /**
   * The JSON converter used as the default converter, if the current
   * converter does not handle the value.
   * @type {JSONConverter<T extends TYPE>}
   * @default undefined The property is by default undefined.
   */
  #parent;

  /**
   * The space property used for stringification.
   * @type {string|number|undefined} The number of spaces used as spacing, or the string used as spacing.
   * @default undefined The property is by default undefined.
   */
  #space;

  /**
   * Create a new json convertert.
   * @param {object} param0 The options parameter.
   * @param {JSONReviver} [reviver] The function used to replace the objects during stringify.
   * Defaults to the default reviver.
   * @param {JSONReplacer} [replacer] The function used to revive the objects during prase.
   * Defaults to the default replacer.
   * @param {JSONConverter<T extends TYPE>} [parent] The default converter. Defaults to a wrapper with undefined
   * reviver and replacer.
   * @param {Predicate<TYPE>} [validator] The validator returning true if and only if the stringified
   * value is handled by this converter. Defaults to a predicate accepting all values.
   */
  constructor({ reviver, replacer, validator, parent, validator = (value) => (true) }) {
    this.#validator = validator;
    this.#parent = parent;
    this.#reviver = reviver;
    this.#replacer = replacer;
    this.#space = space;
  }

  /**
   * The space parameter used for stringification.
   * @type {number|string|undefined} The number of spaces used to pad the created json, or the string used to
   * prefix all objects and arrays. If the number is less than 1, no spaces are added.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters
   */
  get space() {
    return this.#space;
  }

  /**
   * The reviver parameter used for parsing the result.
   * @type {JSONReviver} 
   */
  get reviver() {
    return this.#reviver == null ? this.#parent?.reviver : this.#reviver;
  }

  /**
   * The replacer parameter used as replacer parameter of the stringification.
   * @type {JSONReplacer}
   */
  get replacer() {
    return this.#replacer == null ? this.#parent?.replacer : this.#replacer;
  }

  /**
   * Performs stringification of an valid value.
   * @param {*} value The stringified value.
   * @param {JSONReplacer} [replacer] The replacer paramter of the stringification.
   * @param {number|string|undefined} [space] The space parameter of the stringification.
   * @returns {string} The JSON value used for stringification, the original value.
   * @throws {TypeError} The stringification contained an invalid value or an unhandled circular reference.
   */
  stringify(value, replacer = undefined, space = undefined) {
    if (this.#validator(value)) {
      // Performing stringification.
      return JSON.stringify(value, replacer || this.replacer, space || this.space);
    } else if (this.#parent) {
      return this.#parent.stringify(value, replacer, space);
    } else {
      // The value is unchanged.
      return value;
    }
  }

  /**
   * Parses a value using the converter.
   * @param {string} source The parsed value. 
   * @param {JSONReviver} [reviver] The reviver function. Defaults to the reviver of the current object.
   */
  parse(source, reviver = undefined) {
    if (this.#jsonValidate(source)) {
      // The current converter handles the value.
    } else if (this.#parent) {
      // Let the parent handle it.
      this.#parent.parse(source, reviver);
    } else {
      // The value is not handled.
      return source;
    }
  }

}