import axios from "axios";

export async function fetchDateRangeContributions(username, startDate = "2025-01-01", endDate = "2025-08-31", namespace = 0, offset = 0) {
  const cleanUsername = username.trim().replace(/ /g, "_");
  
  const url = `https://xtools.wmcloud.org/api/user/globalcontribs/${encodeURIComponent(cleanUsername)}/${namespace}/${startDate}/${endDate}/${offset}`;

  try {
    const response = await axios.get(url);
    return response.data.globalcontribs || [];
  } catch (error) {
    console.error("Error fetching date range contributions:", error);
    return [];
  }
}