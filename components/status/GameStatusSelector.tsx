"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type GameStatus = "PLAYED" | "PLAYING" | "WISHLIST";

type Props = {
  gameId: number;
  title: string;
  coverUrl?: string | null;
  initialStatus: GameStatus | null;
};

export default function GameStatusSelector({
  gameId,
  title,
  coverUrl,
  initialStatus,
}: Props) {
  const [status, setStatus] = useState<GameStatus | "">(
    initialStatus ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(nextStatus: GameStatus) {
    setStatus(nextStatus);
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          status: nextStatus,
          title,
          coverUrl, 
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save status");
      }
    } catch {
      setError("Could not update status");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-2">
        <h2 className="text-xs uppercase tracking-wide text-gray-400">
          Your Status
        </h2>

        <select
          value={status}
          onChange={(e) =>
            handleChange(e.target.value as GameStatus)
          }
          className="bg-[#14181c] border-2 border-black p-2 text-gray-200"
        >
          <option value="">Set status</option>
          <option value="PLAYING">Playing</option>
          <option value="PLAYED">Played</option>
          <option value="WISHLIST">Wishlist</option>
        </select>

        {saving && (
          <p className="text-xs text-gray-400">
            Saving…
          </p>
        )}

        {error && (
          <p className="text-xs text-red-400">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
