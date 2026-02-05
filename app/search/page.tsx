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
    if (!query) {
      setResults([]);
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
          setError("Something went wrong");
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
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-black">Search Games</h1>

      <input
        type="text"
        placeholder="It Exists? It's Here..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md border-2 border-black shadow-[4px_4px_0px_0px_black] px-4 py-2"
      />

      {loading && <p>Searching games...</p>}
      {error && <p className="text-red-600">{error}</p>}

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {results.map((game) => (
    <Card key={game.id}>
      <CardContent className="space-y-3">
        <Link href={`/games/${game.id}`}>
          <p className="font-bold text-lg underline hover:text-[#00e054]">
            {game.name}
          </p>
        </Link>

        {game.cover?.url && (
          <Image
            src={`https:${game.cover.url.replace("t_thumb", "t_cover_big")}`}
            alt={game.name}
            width={128}
            height={180}
            unoptimized
          />
        )}

        {game.platforms && (
          <p className="text-sm text-gray-400">
            {game.platforms.map((p) => p.name).join(", ")}
          </p>
        )}
      </CardContent>
    </Card>
  ))}
</ul>




      {!loading && query && results.length === 0 && (
        <p>No games found.</p>
      )}
    </main>
  );
}
