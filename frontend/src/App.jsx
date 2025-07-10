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
    const contribsURL = `https://commons.wikimedia.org/w/api.php?action=query&list=usercontribs&ucuser=${username}&uclimit=5&format=json&origin=*`;
    const userInfoURL = `https://commons.wikimedia.org/w/api.php?action=query&list=users&ususers=${username}&usprop=editcount|registration|groups&format=json&origin=*`;

    const [contribsRes, userRes] = await Promise.all([
      axios.get(contribsURL),
      axios.get(userInfoURL),
    ]);

    const contribs = contribsRes.data.query.usercontribs;
const user = userRes.data.query.users[0];

    if (!user || user.missing || !user.editcount) {
        throw new Error("Invalid or inactive Wikimedia user.");
      }

    const mood = getUserMood({
      editCount: user.editcount,
      registrationDate: user.registration,
      recentEdits: contribs, // ✅ this is the correct data
    });

    
    const formatted = {
  username: user.name,
  totalEdits: user.editcount || "N/A",
  activeSince: user.registration
    ? new Date(user.registration).toLocaleDateString()
    : "Unknown",
  topTopics: [],
  recentEdits: contribs.map((c) => c.title),
  mood: mood, // ✅ use the mood you computed
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
      <h1 className="text-2xl text-gray-600 font-black-100 font-bold mb-4">
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
