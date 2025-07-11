

import React, { useState } from "react";
import { X, User } from "lucide-react"; // Import the User icon along with X

// Consider moving suggestedUsers to a separate data file or fetching from an API
const suggestedUsers = ["Jimbo Wales", "Shreya.Bhopal", "Krinkle"];

function UserInput({ onFetch }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(""); // State for error messages

  const handleSubmit = () => {
    if (username.trim()) {
      onFetch(username.trim()); // Trim whitespace before passing to onFetch
      setError(""); // Clear any previous errors
    } else {
      setError("Please enter a username."); // Set error if input is empty
    }
  };

  const handleClearInput = () => {
    setUsername("");
    setError(""); // Clear error when input is cleared
  };

  const handleSuggestedUserClick = (user) => {
    setUsername(user);
    setError(""); // Clear error when a suggestion is selected
  };

  return (
    <div className="w-full">
      <div className="flex items-center relative mb-2">
        <input
          type="text"
          id="username-input" // Add id for accessibility with label
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Enter Wikimedia username"
          aria-label="Enter Wikimedia username" // Provide accessible name
          aria-invalid={!!error} // Indicate if the input has an error
          aria-describedby={error ? "username-error" : undefined} // Link to error message
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {username && (
          <button
            onClick={handleClearInput}
            className="absolute right-[85px] flex items-center pr-3 focus:outline-none text-gray-400 hover:text-gray-600 hover:border-0 border-spacing-0 bg-inherit"
            aria-label="Clear username input"
          >
            <X size={20} color="currentColor" />
          </button>
        )}
        <button
          onClick={handleSubmit}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Fetch
        </button>
      </div>

      {error && (
        <p id="username-error" className="text-red-600 text-sm mt-1" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      {suggestedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 text-sm text-blue-700">
          <span className="sr-only">Suggested users:</span>
          {suggestedUsers.map((user) => (
            <button
              key={user}
              onClick={() => handleSuggestedUserClick(user)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 hover:text-gray-300 px-3 py-1 rounded-full transition flex items-center gap-1" // Added flex and gap
            >
              <User size={16} className="text-blue-600" /> {/* User icon */}
              {user}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserInput;