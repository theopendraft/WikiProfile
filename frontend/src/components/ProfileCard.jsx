import React from "react";
import Heatmap from "./Heatmap";
import { Clock } from "lucide-react"; // Icon ke liye
import EditList from "./EditList";

function ProfileCard({ data }) {
  const [showCount, setShowCount] = React.useState(5);
  const handleShowMore = () => setShowCount((prev) => prev + 5);
  const handleShowLess = () => setShowCount(5);
  return (
    <div
      className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-full border border-gray-200 dark:border-gray-700"
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
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center hover:shadow-md">
          <p className="text-sm text-gray-600 dark:text-gray-300">Global Edits</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-300">
            {data.totalEdits}+
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center hover:shadow-md">
          <p className="text-sm text-gray-600 dark:text-gray-300">Active Since</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-300 truncate">
            {data.activeSince}
          </p>
        </div>
      </div>

      {/* Heatmap */}
      {data.heatmapData?.length > 0 && (
        <div className="mt-6 rounded-lg shadow-md hover:shadow-lg hover:border-gray-300 dark:border-gray-700 ">
          <Heatmap contributions={data.heatmapData} />
        </div>
      )}

      {/* Top Articles - Improved Layout */}
      {data.topPages?.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg hover:border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6.75A2.25 2.25 0 0014.25 4.5h-4.5A2.25 2.25 0 007.5 6.75v1.5m9 0v1.5m0-1.5h-9m9 0h1.5A2.25 2.25 0 0120.25 10.5v7.5A2.25 2.25 0 0118 20.25h-12A2.25 2.25 0 013.75 18V10.5A2.25 2.25 0 016 8.25H7.5m9 0v1.5m-9-1.5v1.5" /></svg>
            </span>
            <h3 className="text-base font-bold text-gray-700 dark:text-gray-100 tracking-tight">Top Edited Articles</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {data.topPages.map((page, i) => (
              <li
                key={i}
                className="group bg-gray-50 dark:bg-gray-900/40 rounded-lg px-4 py-3 border border-gray-100 dark:border-gray-700 hover:shadow transition flex flex-col md:flex-row md:items-center md:justify-between gap-2 relative"
              >
                <div className="flex-1 min-w-0">
                  <a
                    href={page.link}
                    className="text-blue-700 dark:text-blue-300 font-medium text-sm md:text-base hover:underline hover:text-blue-900 dark:hover:text-blue-100 transition"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={page.title}
                  >
                    {page.title}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold border border-gray-300 dark:border-gray-600 ${page.class === "B"
                      ? "bg-green-500 text-white dark:bg-green-600"
                      : page.class === "C"
                        ? "bg-yellow-400 text-black dark:bg-yellow-500"
                        : "bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                      }`}
                  >
                    {page.class}
                  </span>
                  <span className="text-green-600 dark:text-green-300 font-bold">
                    {page.count} <span className="font-normal">edits</span>
                  </span>
                </div>
                {i < data.topPages.length - 1 && (
                  <div className="absolute left-4 right-4 bottom-0 h-px bg-gray-200 dark:bg-gray-700 opacity-60" style={{ marginTop: '12px' }} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Edits - Improved Layout */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg hover:border-gray-300   mt-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" /></svg>
          </span>
          <h3 className="text-base font-bold text-gray-700 dark:text-gray-100 tracking-tight">Recent Edits</h3>
        </div>
        {data.recentEdits.length > 0 ? (
          <>
            <ul className="flex flex-col gap-3">
              {data.recentEdits.slice(0, showCount).map((edit, index) => (
                <li
                  key={index}
                  className="group bg-gray-50 dark:bg-gray-900/40 rounded-lg px-4 py-3 border border-gray-100 dark:border-gray-700 hover:shadow transition relative"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    {/* Article Title & Comment */}
                    <div className="flex-1 min-w-0">
                      <a
                        href={
                          edit.full_page_title
                            ? `https://${(edit.project || edit.wiki)?.replace(/^https?:\/\//, '')}/wiki/${encodeURIComponent(edit.full_page_title.replace(/ /g, '_'))}`
                            : edit.link
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 dark:text-blue-300 font-medium text-sm md:text-base hover:underline hover:text-blue-900 dark:hover:text-blue-100 transition"
                        title={edit.full_page_title || edit.title}
                      >
                        {edit.full_page_title || edit.title}
                      </a>
                      <div className="text-xs text-gray-500 dark:text-gray-400 italic mt-1 truncate" title={edit.comment?.trim() || 'No edit summary provided'}>
                        {edit.comment?.trim() || "No edit summary provided"}
                      </div>
                    </div>
                    {/* Meta Info */}
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1 shrink-0 text-xs text-gray-500 dark:text-gray-300">
                      <span className="flex items-center gap-1">

                        {edit.project || edit.wiki}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {new Date(edit.timestamp).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        {" "}
                        {new Date(edit.timestamp).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                  {index < Math.min(showCount, data.recentEdits.length) - 1 && (
                    <div className="absolute left-4 right-4 bottom-0 h-px bg-gray-200 dark:bg-gray-700 opacity-60" style={{ marginTop: '12px' }} />
                  )}
                </li>
              ))}
            </ul>
            <div className="flex justify-center mt-5 gap-4">
              {showCount < data.recentEdits.length && (
                <button
                  onClick={handleShowMore}
                  className=" md:text-base hover:underline  dark:hover:text-blue-100 font-medium shadow-sm *:px-4 py-2 bg-transparent text-white rounded transition border *:border-gray-300 dark:border-gray-600 hover:border-blue-700"
                >
                  Show More
                </button>
              )}
              {showCount > 5 && (
                <button
                  onClick={handleShowLess}
                  className=" md:text-base hover:underline  dark:hover:text-blue-100 font-medium shadow-sm *:px-4 py-2 bg-transparent text-white rounded transition border *:border-gray-300 dark:border-gray-600 hover:border-blue-700"
                >
                  Show Less
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-300">
            No recent edits found.
          </p>
        )}
      </div>



      {/* --- LAST 5 GLOBAL CONTRIBUTIONS SECTION --- */}
      {/* <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Last 5 Global Activities
        </h3>
        {data.recentEdits && data.recentEdits.length > 0 ? (
          <ul className="space-y-4">
            {data.recentEdits.map((edit, index) => (
              <li key={index} className="flex items-start gap-4">
                <Clock className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <a
                    href={edit.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {edit.title}
                  </a>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    
                    <span className="font-semibold">{edit.wiki?.replace('.org', '')}</span>
                    {' • '}
                    {new Date(edit.timestamp).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">
            No recent contributions found.
          </p>
        )}
      </div> */}



      {/* Edit List - New Section Added */}
      {/* <div className="mt-6">
        <EditList edits={data.edits} isLoading={false} error={null} searchedUser={data.username} />
      </div> */}
    </div>
  );
}

export default ProfileCard;