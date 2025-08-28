/**
 * Fetches global edits for a given Wikimedia username.
 * @param {string} username - The username to search for.
 * @returns {Promise<Array>} A promise that resolves to an array of edit objects.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export const fetchGlobalEdits = async (
  username,
  startDate = "",
  endDate = ""
) => {
  // First, trim whitespace, then replace all spaces with underscores.
  const formattedUsername = username.trim().replaceAll(" ", "_");

  // Use date as YYYY-MM-DD for API (no conversion needed)
  const start = startDate;
  const end = endDate;

  // Build date params for the API URL if provided
  let apiUrl;
  if (start && end) {
    // Use date range URL structure (no /0)
    apiUrl = `https://xtools.wmcloud.org/api/user/globalcontribs/${encodeURIComponent(
      formattedUsername
    )}/all/${start}/${end}/`;
  } else {
    // Default to first 50 edits (with /0)
    apiUrl = `https://xtools.wmcloud.org/api/user/globalcontribs/${encodeURIComponent(
      formattedUsername
    )}/all/0`;
  }

  console.log("XTools API URL:", apiUrl);
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`User not found or API error (Status: ${response.status})`);
  }

  const data = await response.json();

  return data.globalcontribs || [];
};
