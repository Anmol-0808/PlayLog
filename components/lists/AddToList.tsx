"use client";

import { useState } from "react";

type List = {
  id: string;
  name: string;
};

type Props = {
  gameId: number;
  title: string;
  lists: List[];
};

export default function AddToList({
  gameId,
  title,
  lists,
}: Props) {
  const [selectedList, setSelectedList] = useState("");
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleAdd() {
    if (!selectedList) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/lists/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listId: selectedList,
          gameId,
          title,
        }),
      });

      if (!res.ok) throw new Error();
      setMessage("Added to list");
    } catch {
      setMessage("Failed to add");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!newListName.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newListName,
        }),
      });

      const list = await res.json();

      await fetch("/api/lists/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listId: list.id,
          gameId,
          title,
        }),
      });

      setMessage("List created & game added");
      setNewListName("");
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-2 border-black bg-[#1f2328] p-4 space-y-3">
      <h2 className="text-xs uppercase tracking-wide text-gray-400">
        Add to List
      </h2>

      {lists.length > 0 && (
        <div className="flex gap-2">
          <select
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
            className="bg-[#14181c] border-2 border-black p-2 text-gray-200 flex-1"
          >
            <option value="">Select a list</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAdd}
            disabled={loading || !selectedList}
            className="border-2 border-black px-3"
          >
            Add
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name"
          className="bg-[#14181c] border-2 border-black p-2 text-gray-200 flex-1"
        />
        <button
          onClick={handleCreate}
          disabled={loading || !newListName}
          className="border-2 border-black px-3"
        >
          Create
        </button>
      </div>

      {message && (
        <p className="text-xs text-gray-400">{message}</p>
      )}
    </div>
  );
}
