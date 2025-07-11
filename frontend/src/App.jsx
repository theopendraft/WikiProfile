import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import UserInput from "./components/UserInput";
import axios from "axios";

import { getUserMood } from "./utils/getUserMood";
import { fetchGlobalEditCount } from "./utils/fetchGlobalEditCount";
import { fetchTopEditedPages } from "./utils/fetchTopEditedPages";
import { fetchRecentEdits } from "./utils/fetchRecentEdits";
import { fetchGlobalFirstEdit } from "./utils/fetchGlobalFirstEdit";

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (username) => {
    setLoading(true);
    setError("");
    setUserData(null); // Hide card immediately on fetch

    try {
      const cleanUsername = username.trim().replace(/ /g, "_");

      // ✅ Step 1: Fetch user profile info (for registration date, etc)
      const userInfoURL = `https://en.wikipedia.org/w/api.php?action=query&list=users&ususers=${cleanUsername}&usprop=editcount|registration|groups&format=json&origin=*`;
      const userRes = await axios.get(userInfoURL);
      const user = userRes.data.query.users[0];

      // If user does not exist on English Wikipedia, check other projects
      if (!user || user.missing) {
        setError(
          "User not found on English Wikipedia. Please check the username."
        );
        setLoading(false);
        return;
      }

      // ✅ Step 2: Fetch global edit count from multiple projects
      const globalEditData = await fetchGlobalEditCount(cleanUsername);

      // If user has zero edits on all projects, treat as not found
      const totalEdits = globalEditData.total;
      if (totalEdits === 0) {
        setError("User not found on any major Wikimedia project.");
        setLoading(false);
        return;
      }

      const recentEdits = await fetchRecentEdits(
        "en.wikimedia.org",
        cleanUsername
      );

      const topEdits = await fetchTopEditedPages(
        "en.wikipedia.org",
        cleanUsername
      );

      const topTopics = topEdits.length
        ? topEdits.slice(0, 3).map((p) => p.title)
        : ["No major article contributions"];

      // Fetch first edit timestamp (active since) from ALL projects
      const firstEditTimestamp = await fetchGlobalFirstEdit(cleanUsername);

      // ✅ Step 3: Compute mood
      const mood = getUserMood({
        editCount: totalEdits,
        registrationDate: user.registration,
        recentEdits: [], // You can enhance this later
      });

      // ✅ Step 4: Prepare final object
      const formatted = {
        username: user.name,
        totalEdits,
        activeSince: firstEditTimestamp
          ? new Date(firstEditTimestamp).toLocaleDateString()
          : "Unknown",
        topTopics,
        topPages: topEdits.slice(0, 5),
        recentEdits,
        mood,
      };

      setUserData(formatted);
    } catch (err) {
      console.error(err);
      setError("User not found or API error.");
      setUserData(null);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-100 dark:bg-gray-800 justify-content-center flex flex-col items-center justify-start p-6">
      <div className="w-full min-h-full max-w-2xl bg-white dark:bg-gray-600 shadow-md justify-content-center rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          🔍 Quick Wiki Profile Card
        </h1>

        <UserInput onFetch={fetchData} />
        <div
          className="flex justify-center items-center mt-6"
          role="status"
          aria-busy="true"
        >
          {loading && (
            <div className="flex justify-center items-center mt-6">
              <div className="w-6 h-6 border-4 border-[#0063bf] border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-sm text-[#0063bf] font-medium">
                Fetching profile...
              </span>
            </div>
          )}
        </div>

        {error && <p className="text-red-600 text-center mt-4">{error}</p>}

        {/* Show ProfileCard only when not loading and userData exists */}
        {!loading && userData && (
          <div className="mt-6 flex flex-col items-center justify-center w-full max-w-2xl bg-gray-100 dark:bg-gray-600 shadow-md rounded-2xl p-6 animation-fade-in">
            <ProfileCard data={userData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
