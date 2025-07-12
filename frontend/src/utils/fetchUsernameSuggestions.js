// utils/fetchUsernameSuggestions.js
export async function fetchUsernameSuggestions(prefix) {
  if (!prefix) return [];
  try {
    const res = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&list=allusers&auprefix=${prefix}&aulimit=10&format=json&origin=*`
    );
    const data = await res.json();
    return data.query.allusers.map((user) => user.name);
  } catch (err) {
    console.warn("Failed to fetch username suggestions:", err);
    return [];
  }
}
