function ProfileCard({ data }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
      <h2 className="text-xl text-blue-600 font-semibold">@{data.username}</h2>
      <p className="mt-1 text-sm text-gray-600">
        📅 Active Since: {data.activeSince}
      </p>
      <p className="mt-1 text-sm text-gray-600">
        🏆 Total Edits: {data.totalEdits}
      </p>

<div className="mt-4">
  <h3 className="text-sm font-semibold text-gray-600 mb-1">🕒 Recent Edits</h3>
  {data.recentEdits.length > 0 ? (
    <ul className="list-disc pl-4 text-sm">
      {data.recentEdits.map((edit, index) => (
        <li key={index}>
          <a
            href={edit.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {edit.title}
          </a>{" "}
          <span className="block text-xs text-gray-500 break-words">

            ({new Date(edit.timestamp).toLocaleString()})
          </span>
          <div className="text-xs text-gray-600 italic">
            {edit.comment?.trim() ? edit.comment : "- No edit summary given"}
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-gray-500">No recent edits found.</p>
  )}
</div>



      <div className="mb-2">
        <h3 className="font-medium text-blue-600">Top Edited Articles</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {data.topPages?.map((page, i) => (
            <li key={i}>
              <a
                href={page.link}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {page.title}
              </a>{" "}
              — {page.count} edits{" "}
              <span
                className="inline-block text-xs px-2 py-0.5 rounded"
                style={{ backgroundColor: page.color }}
              >
                {page.class}
              </span>
            </li>
          ))}
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
