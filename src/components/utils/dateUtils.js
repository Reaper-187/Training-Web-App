export function getISOWeek(dateString) {
  const date = new Date(dateString);

  // Donnerstag der aktuellen Woche berechnen
  const thursday = new Date(date);
  thursday.setDate(date.getDate() - ((date.getDay() + 6) % 7) + 3);

  // Ersten Donnerstag des Jahres finden
  const firstThursday = new Date(thursday.getFullYear(), 0, 4);
  firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

  // Differenz der Tage durch 7 teilen => Kalenderwoche berechnen
  const weekNumber = Math.round((thursday - firstThursday) / (7 * 24 * 60 * 60 * 1000)) + 1;

  return weekNumber;
}
