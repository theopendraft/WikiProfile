import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import UserInput from "./components/UserInput";
import axios from "axios";
import { getUserMood } from "./utils/getUserMood";
import { fetchGlobalEditCount } from "./utils/fetchGlobalEditCount";
import { fetchTopEditedPages } from "./utils/fetchTopEditedPages";
import { fetchRecentEdits } from "./utils/fetchRecentEdits";


function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (username) => {
    setLoading(true);
    setError("");

    try {
      const cleanUsername = username.trim().replace(/ /g, "_");

      // ✅ Step 1: Fetch user profile info (for registration date, etc)
      const userInfoURL = `https://en.wikipedia.org/w/api.php?action=query&list=users&ususers=${cleanUsername}&usprop=editcount|registration|groups&format=json&origin=*`;
      const userRes = await axios.get(userInfoURL);
      const user = userRes.data.query.users[0];
      
      if (!user || user.missing) {
        throw new Error("Invalid or inactive Wikimedia user.");
      }

      // ✅ Step 2: Fetch global edit count from multiple projects
      const globalEditData = await fetchGlobalEditCount(cleanUsername);

     const recentEdits = await fetchRecentEdits("en.wikipedia.org", cleanUsername);


      const topEdits = await fetchTopEditedPages(
        "en.wikipedia.org",
        cleanUsername
      );

      const topTopics = topEdits.length
        ? topEdits.slice(0, 3).map((p) => p.title)
        : ["No major article contributions"];

      // ✅ Step 3: Compute mood
      const mood = getUserMood({
        editCount: globalEditData.total,
        registrationDate: user.registration,
        recentEdits: [], // You can enhance this later
      });

      // ✅ Step 4: Prepare final object
      const formatted = {
        username: user.name,
        totalEdits: globalEditData.total,
        activeSince: user.registration
          ? new Date(user.registration).toLocaleDateString()
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
      <h1 className="text-2xl text-gray-600 font-bold mb-4">
        🔍 Quick Wiki Profile Card
      </h1>
      <UserInput onFetch={fetchData} />
      {loading && <p className="text-blue-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {userData && <ProfileCard data={userData} />}
    </div>
  );
}

export default App;
