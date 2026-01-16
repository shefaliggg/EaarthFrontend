export const getWeekRange = (date) => {
  const d = new Date(date);
  const day = d.getDay() === 0 ? 7 : d.getDay(); // Sunday → 7

  const monday = new Date(d);
  monday.setDate(d.getDate() - (day - 1));

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { monday, sunday };
};

export const formatWeekRange = (start, end) => {
  const sameMonth = start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${start.getDate()} – ${end.getDate()} ${start.toLocaleDateString(
      "en-US",
      { month: "short" }
    )} ${start.getFullYear()}`;
  }

  return `${start.getDate()} ${start.toLocaleDateString("en-US", {
    month: "short",
  })} – ${end.getDate()} ${end.toLocaleDateString("en-US", {
    month: "short",
  })} ${end.getFullYear()}`;
};
