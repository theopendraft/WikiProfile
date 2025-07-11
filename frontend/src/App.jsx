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
        "en.wikipedia.org",
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
    <>
      <div className="min-h-screen flex items-center justify-center bg-dark-100 dark:bg-gray-800">
        <div className="w-full min-h-full max-w-2xl bg-white dark:bg-gray-600 shadow-md flex flex-col justify-center items-center rounded-2xl p-6">
          {/* Wikimedia-style header */}
          <header className="w-full flex items-center gap-3 mb-6 border-b border-gray-200 pb-3">
            <img
              src="./public/wiki_profile_logo.svg"
              alt="Wiki Profile Logo"
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold text-[#0063bf] tracking-tight font-serif">
              Wiki<span className="text-black dark:text-white">Profile</span>
            </span>
            <span className="ml-auto text-xs text-gray-400 font-mono hidden sm:block">
              powered by Wikimedia
            </span>
          </header>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 mt-2 text-center">
            Quick Wiki Profile Card
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
      <footer className="text-xs bg-dark-100 dark:bg-gray-800 text-gray-200 text-center w-full">
        Made with ❤️ using React, Tailwind, and Wikimedia APIs.
        <br />© {new Date().getFullYear()} The open draft
      </footer>
    </>
  );
}

export default App;
