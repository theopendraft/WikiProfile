import React, { useState, useEffect } from "react";
import { fetchDateRangeContributions } from "../utils/fetchDateRangeContributions";

function DateRangeContributions({ username }) {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-08-31");

  useEffect(() => {
    async function loadContributions() {
      setLoading(true);
      const data = await fetchDateRangeContributions(username, startDate, endDate);
      setContributions(data);
      setLoading(false);
    }
    
    loadContributions();
  }, [username, startDate, endDate]);

  const handleSearch = () => {
    // Trigger the useEffect to reload with new dates
    setLoading(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Global Contributions</h2>
      
      <div className="flex flex-wrap gap-3 mb-4">
        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">End Date</label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border rounded"
          />
        </div>
        
        <div className="flex items-end">
          <button 
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-4">Loading contributions...</p>
      ) : contributions.length > 0 ? (
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Page</th>
                <th className="px-4 py-2 text-left">Project</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {contributions.map((edit, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">
                    <a 
                      href={`https://${edit.project}/wiki/${encodeURIComponent(edit.page_title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {edit.page_title}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm">{edit.project.replace('.org', '')}</td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {new Date(edit.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                    {edit.comment || "No summary"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-4">No contributions found in this date range.</p>
      )}
    </div>
  );
}

export default DateRangeContributions;