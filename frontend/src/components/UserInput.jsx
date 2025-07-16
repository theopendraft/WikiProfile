import React, { useState, useEffect, useRef } from "react";
import { X, User } from "lucide-react";
import { fetchUsernameSuggestions } from "../utils/fetchUsernameSuggestions";


// Use wikis.json to inform suggested users (example: static list for now)
const suggestedUsers = ["Jimbo Wales", "Shreya.Bhopal", "Krinkle", "Suyash.dwivedi"];

function useClickOutside(ref, handler) {
  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, handler]);
}

function UserInput({ onFetch, loading }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [autocompleteList, setAutocompleteList] = useState([]);
  const autocompleteRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (username.length >= 2) {
        try {
          const suggestions = await fetchUsernameSuggestions(username);
          if (
            suggestions.length === 1 &&
            suggestions[0].toLowerCase() === username.trim().toLowerCase()
          ) {
            setAutocompleteList([]);
          } else {
            setAutocompleteList(suggestions);
          }
        } catch (err) {
          setAutocompleteList([]);
        }
      } else {
        setAutocompleteList([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [username]);

  useClickOutside(autocompleteRef, () => {
    setAutocompleteList([]);
    setActiveIndex(-1);
  });

  const handleSubmit = () => {
    if (username.trim()) {
      onFetch(username.trim());
      setError("");
    } else {
      setError("Please enter a username.");
    }
  };

  const handleClearInput = () => {
    setUsername("");
    setError("");
    setAutocompleteList([]);
    setActiveIndex(-1);
  };

  const handleSuggestedUserClick = (user) => {
    setUsername(user);
    setError("");
    setAutocompleteList([]);
    setActiveIndex(-1);
  };

  return (
    <div className="w-full items-center mx-auto p-4" ref={autocompleteRef}>
      <div className="relative  flex justify-center items-center gap-3 mb-4 ">
        <div className="relative flex-1">
          <input
            type="text"
            id="username-input"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={(e) => {
              if (autocompleteList.length > 0) {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveIndex((prev) => (prev + 1) % autocompleteList.length);
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveIndex((prev) =>
                    prev <= 0 ? autocompleteList.length - 1 : prev - 1
                  );
                } else if (e.key === "Enter" && activeIndex >= 0) {
                  e.preventDefault();
                  setUsername(autocompleteList[activeIndex]);
                  setAutocompleteList([]);
                  setActiveIndex(-1);
                } else if (e.key === "Escape") {
                  setAutocompleteList([]);
                  setActiveIndex(-1);
                }
              }
              if (e.key === "Enter" && activeIndex === -1) {
                handleSubmit();
              }
            }}
            placeholder="Enter Wikimedia username"
            aria-label="Enter Wikimedia username"
            aria-invalid={!!error}
            aria-describedby={error ? "username-error" : undefined}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
            autoComplete="off"
          />
          {username && (
            <button
              onClick={handleClearInput}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-transparent focus:outline-none"
              aria-label="Clear username input"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition"
          disabled={loading}
          aria-label={loading ? "Fetching data" : "Fetch user data"}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
          ) : (
            "Fetch"
          )}
        </button>
      </div>

      {/* Autocomplete suggestions */}
      {autocompleteList.length > 0 && (
        <ul className="absolute z-10 w-full max-w-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {autocompleteList.map((name, index) => (
            <li
              key={name}
              className={`px-4 py-2 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition ${
                index === activeIndex
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`}
              onClick={() => {
                setUsername(name);
                setAutocompleteList([]);
                setActiveIndex(-1);
              }}
              role="option"
              aria-selected={index === activeIndex}
            >
              {name}
            </li>
          ))}
        </ul>
      )}

      {/* Error message */}
      {error && (
        <p
          id="username-error"
          className="text-red-600 dark:text-red-400 text-sm mt-2"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      {/* Suggested users */}
      {suggestedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="sr-only">Suggested users:</span>
          {suggestedUsers.map((user) => (
            <button
              key={user}
              onClick={() => handleSuggestedUserClick(user)}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-blue-700 dark:text-blue-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition flex items-center gap-1 w-32"
              aria-label={`Select suggested user ${user}`}
            >
              <User size={16} className="text-blue-600 dark:text-blue-300" />
              <span className=" truncate">{user}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserInput;