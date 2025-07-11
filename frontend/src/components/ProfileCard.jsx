function ProfileCard({ data }) {
  return (
    <div className="bg-gray-100 justify-content-center items-center shadow-xl rounded-2xl p-6 w-full max-w-md border border-gray-100 transition-all">
      

      {/* Username */}
      <h2 className="text-2xl flex  font-semibold text-[#0063bf]">
        @{data.username}
      </h2>
      {/* Mood Section */}
      <div className="flex items-center gap-1">
        <span className="text-1 ">{data.mood.emoji}</span>
        <span className="text-sm text-gray-400 dark:text-gray-400">
          {data.mood.label}
        </span>
      </div>

      {/* Edit Metadata */}
      <div className="mt-2 space-y-1 text-sm text-gray-700">
        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="bg-[#0063bf0d] p-4 rounded-lg text-center">
            <p className="text-gray-600 text-sm">Global Edits</p>
            <p className="text-xl font-bold text-[#0063bf]">
              {data.totalEdits}
            </p>
          </div>
          <div className="bg-[#3399661a] p-4 rounded-lg text-center">
            <p className="text-gray-600 text-sm">Active Since</p>
            <p className="text-xl font-bold text-[#339966]">
              {data.activeSince}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Edits */}
      {data.project === "global" ? (
        <p className="mt-4 text-sm text-gray-500 italic">
          🔕 No per-project recent edits available in global mode.
        </p>
      ) : (
        <div className="mt-4 bg-white dark:bg-gray-200 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">
            🕒 Recent Edits
          </h3>
          {data.recentEdits.length > 0 ? (
            <ul className="space-y-3">
              {data.recentEdits.map((edit, index) => (
                <li key={index} className="text-sm">
                  <a
                    href={edit.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0063bf] font-medium hover:underline"
                  >
                    {edit.title}
                  </a>
                  <div className="text-xs text-gray-500">
                    ({new Date(edit.timestamp).toLocaleString()})
                  </div>
                  <div className="text-xs text-gray-600 italic mt-0.5">
                    {edit.comment?.trim()
                      ? edit.comment
                      : "No edit summary provided"}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recent edits found.</p>
          )}
        </div>
      )}

      {/* Top Articles */}
      {data.topPages && data.topPages.length > 0 && (
        <div className="mt-4 bg-white dark:bg-gray-200 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">
            📚 Top Edited Articles
          </h3>
          <ul className="list-disc space-y-2 text-sm">
            {data.topPages.map((page, i) => (
              <li key={i}>
                <a
                  href={page.link}
                  className="text-[#0063bf] hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {page.title}
                </a>{" "}
                —{" "}
                <span className="text-[#339966] text-sm">
                  {page.count} edits
                </span>{" "}
                <span
                  className={` inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${
                    page.class === "B"
                      ? "bg-wmgreen text-white"
                      : page.class === "C"
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-300 text-gray-800"
                  }`}
                  style={{
                    backgroundColor: page.color || "#ccc",
                  }}
                >
                  {page.class}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProfileCard;
