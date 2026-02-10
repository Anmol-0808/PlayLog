"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

type Game = {
  id: number;
  name: string;
  cover?: {
    url: string;
  };
  platforms?: {
    name: string;
  }[];
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function searchGames() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/games/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch games");
        }

        const data = await res.json();
        setResults(data);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(searchGames, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <main className="min-h-screen bg-[#14181c] text-gray-200 p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <section className="space-y-1">
          <h1 className="text-3xl font-black">Search</h1>
          <p className="text-gray-400">
            Find games to log, rate, and remember.
          </p>
        </section>


        <section>
          <input
            type="text"
            placeholder="It Exists? It's here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-full
              max-w-xl
              bg-[#14181c]
              border-5 border-black
              shadow-[2px_2px_0px_0px_black]
              px-4 py-3
              text-gray-200
              placeholder-gray-500
              focus:outline-none
            "
          />
        </section>

        {loading && (
          <p className="text-sm text-gray-400">
            Searching games…
          </p>
        )}

        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}

        {results.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((game) => (
              <Card
                key={game.id}
                className="border-2 border-black bg-[#1f2328]"
              >
                <CardContent className="p-4 space-y-3">
                  <Link
                    href={`/games/${game.id}`}
                    className="font-semibold text-lg hover:underline"
                  >
                    {game.name}
                  </Link>

                  {game.cover?.url && (
                    <Image
                      src={`https:${game.cover.url.replace(
                        "t_thumb",
                        "t_cover_big"
                      )}`}
                      alt={game.name}
                      width={128}
                      height={180}
                      unoptimized
                    />
                  )}

                  {game.platforms && game.platforms.length > 0 && (
                    <p className="text-sm text-gray-400">
                      {game.platforms.map((p) => p.name).join(", ")}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </section>
        )}

        {!loading && query && results.length === 0 && (
          <p className="text-sm text-gray-400">
            No games found.
          </p>
        )}


        {!query && (
          <p className="text-sm text-gray-500">
            Start by typing the name of a game.
          </p>
        )}
      </div>
    </main>
  );
}
