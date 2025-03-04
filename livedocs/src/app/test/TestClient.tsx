"use client";

import { useState } from "react";

export default function TestClient({
  initialTests,
}: {
  initialTests: { id: string; name: string }[];
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [tests, setTests] = useState(initialTests);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      const newTest = await res.json();
      setTests((prev) => [...prev, newTest]); // Update UI immediately
      setMessage("Test entry added successfully!");
      setName(""); // Clear input field
    } else {
      setMessage("Failed to add entry");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Form to Add Test Entry */}
      <div className="p-4 border rounded-lg shadow-md max-w-md">
        <h2 className="text-xl font-bold mb-3">Add a Test Entry</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Adding..." : "Submit"}
          </button>
        </form>
        {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>

      {/* Display Test Entries */}
      <div className="p-4 border rounded-lg shadow-md max-w-md mt-4">
        <h2 className="text-xl font-bold mb-3">Test Entries</h2>
        {tests.length > 0 ? (
          <ul className="list-disc pl-5">
            {tests.map((test) => (
              <li key={test.id} className="py-1">
                {test.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No entries found.</p>
        )}
      </div>
    </div>
  );
}
