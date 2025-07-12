import React, { useState, useEffect, useRef } from "react";
import { X, User } from "lucide-react";
import { fetchUsernameSuggestions } from "../utils/fetchUsernameSuggestions";

// Consider moving suggestedUsers to a separate data file or fetching from an API
const suggestedUsers = ["Jimbo Wales", "Shreya.Bhopal", "Krinkle", "Suyash.dwivedi"];

// Custom hook for detecting clicks outside a ref
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

function UserInput({ onFetch }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const [autocompleteList, setAutocompleteList] = useState([]); // For real-time suggestions
  const autocompleteRef = useRef(null);

  // Real-time username suggestions (debounced)
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (username.length >= 2) {
        try {
          const suggestions = await fetchUsernameSuggestions(username);

          // ✅ Check for exact match and only one suggestion
          if (
            suggestions.length === 1 &&
            suggestions[0].toLowerCase() === username.trim().toLowerCase()
          ) {
            setAutocompleteList([]); // Turn off suggestions
          } else {
            setAutocompleteList(suggestions); // Show suggestions
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



  // Close autocomplete when clicking outside
  useClickOutside(autocompleteRef, () => setAutocompleteList([]));
  const [activeIndex, setActiveIndex] = useState(-1); // -1 means nothing is selected

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
    setAutocompleteList([]);
  };

  const handleSuggestedUserClick = (user) => {
    setUsername(user);
    setError(""); // Clear error when a suggestion is selected
    setAutocompleteList([]);
  };



  return (
    <div className="w-full" ref={autocompleteRef}>
      <div className="flex items-center relative mb-2">
        <input
          type="text"
          id="username-input" // Add id for accessibility with label
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setActiveIndex(-1); // reset active index on change
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
          aria-label="Enter Wikimedia username" // Provide accessible name
          aria-invalid={!!error} // Indicate if the input has an error
          aria-describedby={error ? "username-error" : undefined} // Link to error message
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
          autoComplete="off"
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

      {/* Real-time autocomplete suggestions */}
      {autocompleteList.length > 0 && (
        <ul className="bg-gray-800 border border-gray-500 rounded-lg  shadow absolute z-10 max-h-48 overflow-y-auto scrollbar-hide w-auto p-0 ">
          {autocompleteList.map((name, index) => (
            <li
              key={name}
              className={`px-4 py-2 border-b border-gray-700 hover:border-blue-600 cursor-pointer ${
                index === activeIndex
                  ? "bg-blue-100 text-blue-600 "
                  : "hover:text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => {
                setUsername(name);
                setAutocompleteList([]);
                setActiveIndex(-1);
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p
          id="username-error"
          className="text-red-600 text-sm mt-1"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      {/* Static suggestions as before */}
      {suggestedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 text-sm text-blue-700">
          <span className="sr-only">Suggested users:</span>
          {suggestedUsers.map((user) => (
            <button
              key={user}
              onClick={() => handleSuggestedUserClick(user)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 hover:text-gray-300 px-3 py-1 rounded-full transition flex items-center gap-1 width-32"
            >
              <User size={16} className="text-blue-600" />
              {user}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserInput;