import axios from "axios";

export async function fetchRecentEdits(project, username, limit = 5) {
  const cleanUsername = username.trim().replace(/ /g, "_");
  const url = `https://${project}/w/api.php?action=query&list=usercontribs&ucuser=${cleanUsername}&uclimit=${limit}&ucnamespace=0&format=json&origin=*`;

  try {
    const res = await axios.get(url);
    const edits = res.data?.query?.usercontribs;

    if (!Array.isArray(edits) || edits.length === 0) {
      console.warn("⚠️ No recent edits found.");
      return [];
    }

    return edits.slice(0, 3).map((edit) => ({
      title: edit.title,
      timestamp: edit.timestamp,
      comment: edit.comment || "",
      link: `https://${project}/wiki/${edit.title.replace(/ /g, "_")}`,
    }));
  } catch (err) {
    console.warn("❌ Failed to fetch recent edits:", err.message);
    return [];
  }
}
