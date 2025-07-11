import { useState } from "react";

function UserInput({ onFetch }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) onFetch(username.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center justify-center gap-2 w-full"
    >
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
          placeholder="Try 'Jimbo Wales'"
        required
        className="flex-grow min-w-[220px] max-w-[300px] px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
      <button
        type="submit"
        className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm dark:bg-blue-500 dark:hover:bg-blue-400"
      >
        🔍 Fetch
      </button>
    </form>
  );
}

export default UserInput;
