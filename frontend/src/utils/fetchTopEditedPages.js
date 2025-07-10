import axios from "axios";

export async function fetchTopEditedPages(
  project,
  username,
  start = "2001-01-01",
  end = "2025-01-31"
) {
  const cleanUsername = username.trim().replace(/ /g, "%20");
  const url = `https://xtools.wmcloud.org/api/user/top_edits/${project}/${cleanUsername}/0/${start}/${end}?pagination=0`;

  try {
    const res = await axios.get(url);
    const topEditsArray = res.data?.top_edits?.[0];

    if (!Array.isArray(topEditsArray)) {
      console.warn("⚠️ top_edits[0] is missing or not an array:", res.data);
      return [];
    }

    return topEditsArray.map((item) => ({
      title: item.full_page_title,
      count: item.count,
      class: item.assessment?.class || "Unrated",
      color: item.assessment?.color || "#ccc",
      badge: item.assessment?.badge || null,
      link: `https://${project}/wiki/${item.full_page_title.replace(/ /g, "_")}`,
    }));
  } catch (err) {
    console.warn("❌ Failed to fetch top-edited pages:", err.message);
    return [];
  }
}
