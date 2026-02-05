import Image from "next/image";
import { getIGDBAccessToken } from "@/lib/igdb";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

import { Card, CardContent } from "@/components/ui/card";
import ReviewForm from "@/components/reviews/ReviewForm";

type Game = {
  id: number;
  name: string;
  summary?: string;
  cover?: {
    url: string;
  };
  platforms?: {
    name: string;
  }[];
};

async function getGame(id: string) {
  const token = await getIGDBAccessToken();

  const gameId = Number(id);
  if (Number.isNaN(gameId)) return null;

  const query =
    "fields name, summary, cover.url, platforms.name; " +
    `where id = ${gameId}; ` +
    "limit 1;";

  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
      Accept: "application/json",
    },
    body: query,
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("IGDB error:", await res.text());
    return null;
  }

  const data = await res.json();
  return data[0] ?? null;
}

export default async function GameDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGame(id);

  if (!game) {
    return (
      <main className="min-h-screen bg-[#14181c] text-gray-200 p-8">
        <p>Game not found.</p>
      </main>
    );
  }

  const session = await auth();

  let userReview: {
    rating: number;
    text: string | null;
  } | null = null;

  if (session?.user?.id) {
    const dbGame = await prisma.game.findUnique({
      where: { igdbId: game.id },
    });

    if (dbGame) {
      const review = await prisma.review.findUnique({
        where: {
          userId_gameId: {
            userId: session.user.id,
            gameId: dbGame.id,
          },
        },
      });

      if (review) {
        userReview = {
          rating: review.rating,
          text: review.text,
        };
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#14181c] text-gray-200 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-[260px_1fr] gap-10">
        
        <div className="space-y-4">
          {game.cover?.url && (
            <Image
              src={`https:${game.cover.url.replace("t_thumb", "t_720p")}`}
              alt={game.name}
              width={260}
              height={380}
              unoptimized
            />
          )}

          {game.platforms && game.platforms.length > 0 && (
            <div className="border-2 border-black bg-[#1f2328]">
              <div className="px-3 py-2 border-b-2 border-black text-xs uppercase tracking-wide text-gray-400">
                Where to play
              </div>

              <ul className="divide-y divide-black">
                {game.platforms.map((platform) => (
                  <li
                    key={platform.name}
                    className="px-3 py-2 text-sm text-gray-200"
                  >
                    {platform.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

    
        <div className="space-y-6">
          <h1 className="text-4xl font-black">{game.name}</h1>

          {game.summary && (
            <p className="max-w-2xl text-gray-300 leading-relaxed">
              {game.summary}
            </p>
          )}

          <Card>
            <CardContent className="space-y-4">
              <ReviewForm
                gameId={game.id}
                initialReview={userReview}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
