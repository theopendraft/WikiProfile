import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import UserInput from "./components/UserInput";
import axios from "axios";
import { getUserMood } from "./utils/getUserMood";

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (username) => {
    setLoading(true);
    setError("");
    try {
      const cleanUsername = username.trim().replace(/ /g, "_");

      // Wikimedia API for usercontribs
      const contribsURL = `https://en.wikipedia.org/w/api.php?action=query&list=usercontribs&ucuser=${cleanUsername}&uclimit=5&format=json&origin=*`;
      const contribsRes = await axios.get(contribsURL);
      const contribs = contribsRes.data.query.usercontribs;

      // XTools data from backend proxy
      const xtoolsURL = `${process.env.REACT_APP_BACKEND_URL}/api/xtools/${cleanUsername}`;

      const xtoolsRes = await axios.get(xtoolsURL);
      const xtoolsData = xtoolsRes.data;

      if (!xtoolsData || !xtoolsData.editcount) {
        throw new Error("Invalid or inactive Wikipedia user.");
      }

      const formatted = {
        username: xtoolsData.user,
        totalEdits: xtoolsData.editcount,
        activeSince: xtoolsData.registration_date
          ? new Date(xtoolsData.registration_date).toLocaleDateString()
          : "Unknown",
        topTopics: xtoolsData.top_pages?.slice(0, 3).map((p) => p.title) || [],
        recentEdits: contribs.map((c) => c.title),
        mood: getUserMood({
          editCount: xtoolsData.editcount,
          registrationDate: xtoolsData.registration_date,
          recentEdits: contribs,
        }),
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
      <h1 className="text-2xl font-bold mb-4">🔍 Quick Wiki Profile Card</h1>
      <UserInput onFetch={fetchData} />
      {loading && <p className="text-blue-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {userData && <ProfileCard data={userData} />}
    </div>
  );
}

export default App;
