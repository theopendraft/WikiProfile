import React from "react";
import Heatmap from "./Heatmap";

function ProfileCard({ data }) {
  return (
    <div
      className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full border border-gray-200 dark:border-gray-700 transition-shadow hover:shadow-xl"
      role="region"
      aria-label="User Profile Card"
    >
      {/* Username */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xl">
          {data.username.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-300">
          {data.username}
        </h2>
      </div>

      {/* Mood Section */}
      <div className="flex items-center gap-2 mt-2 ml-12">
        <span className="text-lg">{data.mood.emoji}</span>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          {data.mood.label}
        </span>
      </div>

      {/* Edit Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Global Edits</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-300">
            {data.totalEdits}+
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Active Since</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-300 truncate">
            {data.activeSince}
          </p>
        </div>
      </div>

      {/* Recent Edits */}
      {data.project === "global" ? (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-300 italic">
          🔕 No per-project recent edits available in global mode.
        </p>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-2">
            🕒 Last Edited Articles
          </h3>
          {data.recentEdits.length > 0 ? (
            <ul className="space-y-4">
              {data.recentEdits.map((edit, index) => (
                <li key={index} className="text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <a
                      href={edit.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-300 font-medium hover:underline"
                    >
                      {edit.title}
                    </a>
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      {new Date(edit.timestamp).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(edit.timestamp).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 italic mt-1">
                    {edit.comment?.trim() || "No edit summary provided"}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-300">
              No recent edits found.
            </p>
          )}
        </div>
      )}

      {/* Top Articles */}
      {data.topPages?.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-2">
            📚 Top Edited Articles
          </h3>
          <ul className="space-y-3">
            {data.topPages.map((page, i) => (
              <li key={i} className="text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <a
                  href={page.link}
                  className="text-blue-600 dark:text-blue-300 hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {page.title}
                </a>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold ${
                      page.class === "B"
                        ? "bg-green-500 text-white dark:bg-green-600"
                        : page.class === "C"
                        ? "bg-yellow-400 text-black dark:bg-yellow-500"
                        : "bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                    }`}
                  >
                    {page.class}
                  </span>
                  <span className="text-green-600 dark:text-green-300">
                    {page.count} edits
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Heatmap */}
      {data.heatmapData?.length > 0 && (
        <div className="mt-6 border border-gray-200 dark:border-gray-700">
          <Heatmap contributions={data.heatmapData} />
        </div>
      )}
    </div>
  );
}

export default ProfileCard;