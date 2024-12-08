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

export const validateDate = (value) => {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;

  if (typeof value === "number") {
    const millisecondsInDay = 86400 * 1000;
    const excelEpoch = new Date(1899, 11, 30);
    const jsDate = new Date(excelEpoch.getTime() + value * millisecondsInDay);
    jsDate.setHours(jsDate.getHours() + 2);
    return jsDate;
  }

  if (typeof value === "string") {
    const dateFormats = [
      /^\d{1,2}[/.-]\d{1,2}[/.-]\d{4}$/,
      /^\d{4}[/.-]\d{1,2}[/.-]\d{1,2}$/,
    ];

    const validDateFormats = dateFormats.some((format) => format.test(value));
    if (!validDateFormats) return null;

    const parsedDate = new Date(value);
    if (isNaN(parsedDate.getTime())) return null;

    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth();
    const day = parsedDate.getDate();

    if (year < 1900 || year > 2100) return null;
    if (month < 0 || month > 11) return null;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    if (day < 1 || day > daysInMonth) return null;

    return parsedDate;
  }

  return null;
};
