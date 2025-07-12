import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import UserInput from "./components/UserInput";
import axios from "axios";
import { motion } from "framer-motion";
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
          ? new Date(firstEditTimestamp).toLocaleDateString('en-GB')
          : "Unknown",
        topTopics,
        topPages: topEdits.slice(0, 5),
        recentEdits,
        mood,
      };

      setUserData(formatted);
    } catch (err) {
      console.error(err);
      setError("User not found or Network error.");
      setUserData(null);
    }

    setLoading(false);
  };

return (
  <>
    <div className=" min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className=" mt-2 md:mt-8 w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 md:p-8"
      >
        {/* Header */}
        <header className="flex items-center gap-3 mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
          <img
            src="/wiki_profile_logo.svg"
            alt="Wiki Profile Logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-serif font-bold text-[#0063bf] tracking-tight">
            Wiki<span className="text-black dark:text-white">Profile</span>
          </h1>
          <span className="ml-auto text-xs text-gray-400 font-mono hidden sm:block">
            powered by Wikimedia
          </span>
        </header>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Quick Wiki Profile Card
        </h2>

        {/* Search */}
        <UserInput onFetch={fetchData} />

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center mt-6 animate-fadeIn">
            <div className="w-6 h-6 border-4 border-[#0063bf] border-t-transparent rounded-full animate-spin mr-2"></div>
            <span className="text-sm text-[#0063bf] font-medium">Fetching profile...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mt-4 animate-fadeIn">{error}</p>
        )}
        
        {/* ProfileCard */}
        {!loading && userData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 w-full flex flex-col items-center"
          >
            <ProfileCard data={userData} />
          </motion.div>
        )}

      </motion.div>
    </div>

    {/* Footer */}
    <footer className="text-xs py-4 text-center bg-gray-50 dark:bg-gray-900 text-gray-400">
      Made with ❤️ using Wikimedia APIs. © {new Date().getFullYear()} The Open Draft
    </footer>
  </>
);
}
export default App;
