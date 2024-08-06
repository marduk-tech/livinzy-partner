function convertInchToFeet(size: number) {
  if (!size) {
    return 0;
  }
  return Math.round(size * 0.08333333333);
}

function convertFeetToInch(size: number | string) {
  if (!size) {
    return 0;
  }
  return Math.round((typeof size == "string" ? parseFloat(size) : size) * 12);
}

const nestedPropertyAccessor = (record: any, keys: string | string[]) => {
  if (Array.isArray(keys)) {
    return keys.reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined),
      record
    );
  } else {
    return record[keys];
  }
};

export { convertFeetToInch, convertInchToFeet, nestedPropertyAccessor };
