import axios from "axios";
import xtoolsProjects from "../../data/xtoolsProjects.json"; // Adjust path if needed

export async function fetchHeatmapReal(username) {
  const cleanUsername = username.trim().replace(/ /g, "_");
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  // Helper to fetch contributions for a single project
  async function fetchProjectContribs(project) {
    const apiDomain = project.replace("www.", ""); // Remove www. if present
    const url = `https://${apiDomain}/w/api.php?action=query&list=usercontribs&ucuser=${cleanUsername}&ucstart=${now.toISOString()}&ucend=${oneYearAgo.toISOString()}&ucprop=timestamp&uclimit=500&format=json&origin=*`;
    try {
      const res = await axios.get(url);
      return res.data?.query?.usercontribs || [];
    } catch {
      return [];
    }
  }

  // Fetch all projects in parallel
  let allContribs = [];
  await Promise.all(
    xtoolsProjects.map(async (project) => {
      const contribs = await fetchProjectContribs(project);
      allContribs = allContribs.concat(contribs);
    })
  );

  // Count edits per day (aggregate across all projects)
  const dateCountMap = {};
  allContribs.forEach(({ timestamp }) => {
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
}
