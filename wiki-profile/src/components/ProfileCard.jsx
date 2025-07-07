function ProfileCard({ data }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold">@{data.username}</h2>
      <p className="mt-1 text-sm text-gray-600">📅 Active Since: {data.activeSince}</p>
      <p className="mt-1 text-sm text-gray-600">🏆 Total Edits: {data.totalEdits}</p>

      <div className="mt-3">
        <h3 className="font-medium">Top Topics:</h3>
        <ul className="flex gap-2 flex-wrap mt-1">
          {data.topTopics.map((topic, i) => (
            <li key={i} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">{topic}</li>
          ))}
        </ul>
      </div>

      <div className="mt-3">
        <h3 className="font-medium">Recent Edits:</h3>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {data.recentEdits.map((title, i) => <li key={i}>{title}</li>)}
        </ul>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-2xl">{data.mood.emoji}</span>
        <span className="text-sm text-gray-700">{data.mood.label}</span>
      </div>
    </div>
  );
}

export default ProfileCard;
