export function getUserMood({ editCount, registrationDate, recentEdits }) {
  const now = new Date();
  const regDate = new Date(registrationDate);
  const accountAgeMonths = (now - regDate) / (1000 * 60 * 60 * 24 * 30);

  const editsInLast30Days = recentEdits.filter((edit) => {
    const editDate = new Date(edit.timestamp);
    return (now - editDate) / (1000 * 60 * 60 * 24) <= 30;
  }).length;

  const editedTitles = recentEdits.map((e) => e.title);

  if (accountAgeMonths > 60 && editCount > 10000) {
    return { emoji: "🧠", label: "Veteran Contributor" };
  }
  if (accountAgeMonths > 24 && editCount > 2000) {
    return { emoji: "🤓", label: "Nerdy Contributor" };
  }
  if (editedTitles.some((t) => t.includes("User") || t.includes("Sandbox") || t.includes("Template"))) {
    return { emoji: "🧹", label: "Cleanup Editor" };
  }
  if (editsInLast30Days >= 100) {
    return { emoji: "🔥", label: "Hyperactive Editor" };
  }
  if (accountAgeMonths < 3 && editCount < 50) {
    return { emoji: "🛸", label: "Newbie" };
  }
  if (accountAgeMonths > 12 && editsInLast30Days === 0) {
    return { emoji: "👻", label: "Ghost Mode" };
  }

  return { emoji: "🤖", label: "Basic Contributor" };
}
