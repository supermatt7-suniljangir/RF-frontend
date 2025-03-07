export function formatDate(isoString: Date) {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Unknown date";

  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    //   hour: 'numeric',
    //   minute: 'numeric',
    //   hour12: true
  });

  return formatter.format(date);
}
