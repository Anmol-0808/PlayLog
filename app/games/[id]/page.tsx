import Image from "next/image";
import Link from "next/link";

import { getIGDBAccessToken } from "@/lib/igdb";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

import ReviewForm from "@/components/reviews/ReviewForm";
import GameStatusSelector from "@/components/status/GameStatusSelector";
import AddToList from "@/components/lists/AddToList";
import { addToFavorites } from "@/app/actions/favorites";
import BackToHome from "@/components/BackToHome";

type PublicReview = {
  rating: number;
  text: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
  };
};

async function getGame(id: string) {
  const token = await getIGDBAccessToken();
  const gameId = Number(id);
  if (Number.isNaN(gameId)) return null;

  const query =
    "fields name, summary, cover.url, platforms.name; " +
    `where id = ${gameId}; limit 1;`;

  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body: query,
    cache: "no-store",
  });

  const data = await res.json();
  return data[0] ?? null;
}

async function getPublicReviews(igdbId: number) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/reviews?igdbId=${igdbId}`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function GameDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGame(id);
  
  const normalizedCover =
  game.cover?.url
    ? game.cover.url.replace(/t_[^/]+/, "t_cover_big")
    : null;



await prisma.game.upsert({
  where: { igdbId: game.id },
  update: {
    title: game.name,
    ...(normalizedCover && { coverUrl: normalizedCover }),
  },
  create: {
    igdbId: game.id,
    title: game.name,
    coverUrl: normalizedCover,
  },
});


  if (!game) {
    return <main className="p-8">Game not found</main>;
  }

  const session = await auth();
  const { averageRating, count, reviews } = await getPublicReviews(
    game.id
  );

  let initialStatus: "PLAYED" | "PLAYING" | "WISHLIST" | null =
    null;
  let lists: { id: string; name: string }[] = [];

  if (session?.user?.id) {
    const dbGame = await prisma.game.findUnique({
      where: { igdbId: game.id },
    });

    if (dbGame) {
      const status = await prisma.userGameStatus.findUnique({
        where: {
          userId_gameId: {
            userId: session.user.id,
            gameId: dbGame.id,
          },
        },
      });
      initialStatus = status?.status ?? null;
    }

    lists = await prisma.list.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
  <main className="min-h-screen bg-[#14181c] text-gray-200 p-8">
    <BackToHome />

    <div className="max-w-7xl mx-auto grid grid-cols-[260px_1fr_300px] gap-10">

   
        <aside className="space-y-4">
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
        </aside>

        <section className="space-y-6">
          <h1 className="text-4xl font-black">{game.name}</h1>

          {averageRating && (
            <div className="text-lg font-semibold">
              ⭐ {averageRating.toFixed(1)} / 5 · {count} reviews
            </div>
          )}

          {game.summary && (
            <p className="max-w-2xl text-gray-300 leading-relaxed">
              {game.summary}
            </p>
          )}

          <ReviewForm gameId={game.id} initialReview={null} />

          <section className="space-y-4">
            <h2 className="text-2xl font-black">
              Community Reviews
            </h2>

            {reviews.length === 0 && (
              <p className="text-gray-400">
                No community reviews yet.
              </p>
            )}

            {reviews.map((review: PublicReview, i: number) => (
              <div
                key={i}
                className="border-2 border-black bg-[#1f2328] p-4 space-y-2"
              >
                <div className="flex justify-between text-sm text-gray-400">
                  <Link
                    href={`/users/${review.user.id}`}
                    className="hover:underline font-medium"
                  >
                    {review.user.name ?? "Anonymous"}
                  </Link>
                  <span>⭐ {review.rating}</span>
                </div>

                {review.text && (
                  <p className="text-gray-200">{review.text}</p>
                )}
              </div>
            ))}
          </section>
        </section>

        <aside className="space-y-4">
  {session && (
    <>
      <GameStatusSelector
        gameId={game.id}
        title={game.name}
        coverUrl={game.coverUrl}
        initialStatus={initialStatus}
      />

      <AddToList
        gameId={game.id}
        title={game.name}
        lists={lists}
      />

     <form
  action={async () => {
    "use server";
    await addToFavorites({
      gameId: game.id,
      title: game.name,
      coverUrl: game.cover?.url
        ? game.cover.url.replace(
            "t_thumb",
            "t_cover_big"
          )
        : null,
    });
  }}
>
  <button
    className="w-full border-2 border-black bg-[#1f2328] px-4 py-2 font-semibold hover:bg-[#24292f]"
  >
    ⭐ Add to Favorites
  </button>
</form>

    </>
  )}
</aside>

      </div>
    </main>
  );
}
