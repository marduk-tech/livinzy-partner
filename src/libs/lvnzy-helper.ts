/**
 * Converts inches to feet
 * @param size - The size in inches
 * @returns The size in feet, rounded to the nearest integer
 */
function convertInchToFeet(size: number) {
  if (!size) {
    return 0;
  }
  return Math.round(size * 0.08333333333);
}

/**
 * Converts feet to inches
 * @param size - The size in feet (can be a number or a string)
 * @returns The size in inches, rounded to the nearest integer
 */
function convertFeetToInch(size: number | string) {
  if (!size) {
    return 0;
  }
  return Math.round((typeof size == "string" ? parseFloat(size) : size) * 12);
}

/**
 * Accesses nested properties of an object
 * @param record - The object to access
 * @param keys - A string or array of strings representing the property path
 * @returns The value of the nested property, or undefined if not found
 */
const nestedPropertyAccessor = (record: any, keys: string | string[]) => {
  if (Array.isArray(keys)) {
    // Reduce through the keys to access nested properties
    return keys.reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined),
      record
    );
  } else {
    // Direct access for single key
    return record[keys];
  }
};

// Export the functions for use in other modules
export { convertFeetToInch, convertInchToFeet, nestedPropertyAccessor };
