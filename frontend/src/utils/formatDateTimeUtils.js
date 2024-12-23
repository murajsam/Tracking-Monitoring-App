export const formatDateTime = (isoDate) => {
  // Parsiraj ISO datum
  const dateObj = new Date(isoDate);

  // Proveri da li je vreme "00:00:00.000Z"
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = Math.round(
    dateObj.getUTCSeconds() + dateObj.getUTCMilliseconds() / 1000
  );

  // Formatiraj datum u traženi oblik
  const day = dateObj.getUTCDate();
  const month = dateObj.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  const year = dateObj.getUTCFullYear();

  // Dodaj sufiks za dan (1st, 2nd, 3rd, itd.)
  const daySuffix = (day) => {
    const j = day % 10,
      k = day % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const formattedDay = `${day}${daySuffix(day)}`;

  // Formatiraj vreme
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;

  // Sastavi ceo string
  return `${formattedDay} ${month}, ${year} ${formattedTime}`;
};
