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

      const contribsURL = `https://en.wikipedia.org/w/api.php?action=query&list=usercontribs&ucuser=${cleanUsername}&uclimit=5&format=json&origin=*`;
      const userInfoURL = `https://en.wikipedia.org/w/api.php?action=query&list=users&ususers=${cleanUsername}&usprop=editcount|registration|groups&format=json&origin=*`;

      const [contribsRes, userInfoRes] = await Promise.all([
        axios.get(contribsURL),
        axios.get(userInfoURL),
      ]);

      const contribs = contribsRes.data.query.usercontribs;
      const recentEdits = contribsRes.data.query.usercontribs;
      const user = userInfoRes.data.query.users[0];

      if (!user || user?.missing || !user.editcount) {
        throw new Error("Invalid or inactive Wikipedia user.");
      }

      const mood = getUserMood({
        editCount: user.editcount,
        registrationDate: user.registration,
        recentEdits,
      });

      const formatted = {
        username: user.name,
        totalEdits: user.editcount,
        activeSince: user.registration
          ? new Date(user.registration).toLocaleDateString()
          : "Unknown",
        topTopics: [], // still optional for now
        recentEdits: recentEdits.map((c) => c.title),
        mood: mood,
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
