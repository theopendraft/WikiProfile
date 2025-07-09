import { useState } from "react";

function UserInput({ onFetch }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) onFetch(username.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter Wikipedia Username"
        className="border border-gray-300 rounded px-3 py-2 w-64"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Fetch
      </button>
    </form>
  );
}

export default UserInput;
