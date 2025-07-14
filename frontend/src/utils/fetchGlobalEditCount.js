import axios from "axios";
import xtoolsProjects from "../../data/xtoolsProjects.json";

export async function fetchGlobalEditCount(username) {
  const cleanUsername = username.trim().replace(/ /g, "_");

  const requests = xtoolsProjects.map(async (project) => {
    const url = `https://xtools.wmcloud.org/api/user/automated_editcount/${project}/${cleanUsername}`;

    try {
      const res = await axios.get(url);
      return res.data.total_editcount || 0;
    } catch (err) {
      console.warn(`❌ Failed for ${project}`, err.message);
      return 0;
    }
  });

  const results = await Promise.all(requests);
  const totalGlobalEdits = results.reduce((sum, count) => sum + count, 0);

  return {
    total: totalGlobalEdits,
    breakdown: results.map((count, i) => ({
      project: xtoolsProjects[i],
      count,
    })),
  };
}
