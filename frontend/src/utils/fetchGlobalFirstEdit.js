import axios from "axios";

const xtoolsProjects = [
  "en.wikipedia.org",
  "commons.wikimedia.org",
  "wikidata.org",
  "meta.wikimedia.org",
  "hi.wikipedia.org",
  // add more if needed
];

export async function fetchGlobalFirstEdit(username) {
  const cleanUsername = username.trim().replace(/ /g, "_");

  const requests = xtoolsProjects.map(async (project) => {
    const url = `https://${project}/w/api.php?action=query&list=usercontribs&ucuser=${cleanUsername}&uclimit=1&ucdir=newer&format=json&origin=*`;
    try {
      const res = await axios.get(url);
      const contribs = res.data.query.usercontribs;
      return contribs.length > 0 ? contribs[0].timestamp : null;
    } catch {
      return null;
    }
  });

  const results = await Promise.all(requests);
  // Filter out nulls and get the earliest date
  const validTimestamps = results.filter(Boolean).map((ts) => new Date(ts));
  if (validTimestamps.length === 0) return null;
  const earliest = new Date(Math.min(...validTimestamps));
  return earliest.toISOString();
}
