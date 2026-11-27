/** Today's date in Nepal as YYYY-MM-DD, so it compares directly with stored dates. */
export function todayInNepal(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kathmandu" }).format(now);
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
