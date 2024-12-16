export const isPotentialDate = (value) => {
  const dateRegex =
    /^\d{1,2}[\/\.]\d{1,2}[\/\.]\d{2,4}\s+\d{1,2}(:\d{2}(:\d{2})?)?$/;
  return typeof value === "string" && dateRegex.test(value);
};

export const convertWeight = (value) => {
  if (value === null || value === undefined) return null;

  const strValue = String(value).toLowerCase().trim();
  const numMatch = strValue.match(
    /^(\d+(\.\d+)?)\s*(kg|kgs|kilogram|kilograms|lb|lbs|pound|pounds)?\s*$/i
  );

  if (!numMatch) return null;

  const num = parseFloat(numMatch[1]);
  const unit = numMatch[3];

  switch (unit) {
    case "lb":
    case "lbs":
    case "pound":
    case "pounds":
      return Number((num * 0.453592).toFixed(2));
    case "kg":
    case "kgs":
    case "kilogram":
    case "kilograms":
    case undefined:
      return Number(num.toFixed(2));
    default:
      return null;
  }
};
