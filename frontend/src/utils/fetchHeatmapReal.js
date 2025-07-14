import axios from "axios";

export async function fetchHeatmapReal(username) {
  const cleanUsername = username.trim().replace(/ /g, "_");
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  // Wikipedia API expects ucstart > ucend (descending order)
  const ucstart = now.toISOString();
  const ucend = oneYearAgo.toISOString();

  const url = `https://en.wikipedia.org/w/api.php?action=query&list=usercontribs&ucuser=${cleanUsername}&ucstart=${ucstart}&ucend=${ucend}&ucprop=timestamp&uclimit=500&format=json&origin=*`;

  try {
    const res = await axios.get(url);
    const contributions = res.data?.query?.usercontribs || [];

    // Count edits per day
    const dateCountMap = {};
    contributions.forEach(({ timestamp }) => {
      const date = timestamp.split("T")[0];
      dateCountMap[date] = (dateCountMap[date] || 0) + 1;
    });

    // Fill in all days in the last year (even if 0 edits)
    const days = [];
    let d = new Date(oneYearAgo);
    while (d <= now) {
      const dateStr = d.toISOString().split("T")[0];
      days.push({
        date: dateStr,
        count: dateCountMap[dateStr] || 0,
      });
      d.setDate(d.getDate() + 1);
    }

    return days;
  } catch (err) {
    console.warn(`Failed fetching heatmap:`, err.message);
    return [];
  }
}
