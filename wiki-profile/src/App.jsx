import ProfileCard from './components/ProfileCard'

function App() {
  const dummyData = {
    username: "Jimbo Wales",
    totalEdits: 10423,
    activeSince: "January 2001",
    topTopics: ["History", "Biography", "Wikipedia"],
    recentEdits: ["Talk:Freedom of speech", "Wikipedia:Policies", "User talk:Editor123"],
    mood: { emoji: "🤓", label: "Nerdy Contributor" }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">🔍 Quick Wiki Profile Card</h1>
      <ProfileCard data={dummyData} />
    </div>
  )
}

export default App;
