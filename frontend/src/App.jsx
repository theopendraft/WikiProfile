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
import Heatmap from "./components/Heatmap";
import { fetchHeatmapReal } from "./utils/fetchHeatmapReal";

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (username) => {
    setLoading(true);
    setError("");
    setUserData(null);

    try {
      const cleanUsername = username.trim().replace(/ /g, "_");
      const userInfoURL = `https://en.wikipedia.org/w/api.php?action=query&list=users&ususers=${cleanUsername}&usprop=editcount|registration|groups&format=json&origin=*`;
      const userRes = await axios.get(userInfoURL);
      const user = userRes.data.query.users[0];

      if (!user || user.missing) {
        setError("User not found on English Wikipedia. Please check the username.");
        setLoading(false);
        return;
      }

      const globalEditData = await fetchGlobalEditCount(cleanUsername);
      const totalEdits = globalEditData.total;
      if (totalEdits === 0) {
        setError("User not found on any major Wikimedia project.");
        setLoading(false);
        return;
      }

      const recentEdits = await fetchRecentEdits("en.wikipedia.org", cleanUsername);
      const topEdits = await fetchTopEditedPages("en.wikipedia.org", cleanUsername);
      const topTopics = topEdits.length
        ? topEdits.slice(0, 3).map((p) => p.title)
        : ["No major article contributions"];
      const firstEditTimestamp = await fetchGlobalFirstEdit(cleanUsername);
      const heatmapData = await fetchHeatmapReal(cleanUsername);

      const mood = getUserMood({
        editCount: totalEdits,
        registrationDate: user.registration,
        recentEdits: [],
      });

      const formatted = {
        username: user.name,
        totalEdits,
        activeSince: firstEditTimestamp
          ? new Date(firstEditTimestamp).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).replace(/ /, " ")
          : "Unknown",
        topTopics,
        topPages: topEdits.slice(0, 5),
        recentEdits,
        mood,
        heatmapData,
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
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="my-8 w-full mt-2 md:mt-8  max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-8 justify-center"
      >
        {/* Header */}
        <header className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <img
            src="/wiki_profile_logo.svg"
            alt="Wiki Profile Logo"
            className="w-10 h-10 rounded-full object-contain"
            onError={(e) => (e.target.src = "/fallback-logo.png")} // Optional fallback
          />
          <h1 className="text-2xl font-serif font-bold text-blue-600 dark:text-blue-400 tracking-tight">
            Wiki<span className="text-gray-900 dark:text-white">Profile</span>
          </h1>
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 font-mono hidden sm:block">
            Powered by Wikimedia
          </span>
        </header>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
          Quick Wiki Profile Card
        </h2>

        {/* Search */}
        <UserInput onFetch={fetchData} loading={loading} />

        {/* Error */}
        {error && (
          <p
            className="text-red-600 dark:text-red-400 text-center mt-6 animate-pulse"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {/* ProfileCard and Heatmap */}
        {!loading && userData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 w-full"
          >
            <ProfileCard data={userData} />
            {userData.heatmapData && (
              <div className="w-full mt-8 max-w-xl mx-auto">
                <Heatmap data={userData.heatmapData} />
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      
    </div>
    {/* Footer */}
      <footer className="text-xs py-6 text-center bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 w-full">
        Made with ❤️ using Wikimedia APIs. © {new Date().getFullYear()} The Open Draft
      </footer>
      </>
  );
}

export default App;