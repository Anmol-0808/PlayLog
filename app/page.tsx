import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";

const EDITORS_PICKS = [
  136879, // Black Myth: Wukong
  119133, // Elden Ring
  25076,  // Red Dead Redemption 2
  20065,  // Resident Evil 4
  277807, // Cyberpunk 2077: Ultimate Edition
  317627, // Ghost of Yotei
  7331,   // Uncharted 4: A Thief's End
  7323,   // Rise of the Tomb Raider
  204350, // The Last of Us Part I
  111318, // Forza Horizon 4: Deluxe Edition
];

export default async function Home() {
  const session = await auth();

  const favoritesList = session?.user
    ? await prisma.list.findFirst({
        where: {
          userId: session.user.id,
          type: "FAVORITES",
        },
        select: { id: true },
      })
    : null;

  const recentlyAdded = await prisma.game.findMany({
    orderBy: { createdAt: "desc" },
    take: 16,
  });

  const topFavorited = await prisma.game.findMany({
    where: {
      listItems: {
        some: { list: { type: "FAVORITES" } },
      },
    },
    orderBy: {
      listItems: { _count: "desc" },
    },
    take: 16,
  });

  const recentlyFavorited = await prisma.listItem.findMany({
    where: {
      list: { type: "FAVORITES" },
    },
    orderBy: { createdAt: "desc" },
    distinct: ["gameId"],
    include: { game: true },
    take: 16,
  });

  const editorsPicks = await prisma.game.findMany({
    where: {
      igdbId: { in: EDITORS_PICKS },
    },
  });

  return (
    <main className="min-h-screen bg-[#14181c] text-gray-200 p-8 space-y-12">

      <header className="flex items-center justify-between h-20">

        <Link href="/" className="flex items-center gap-4 hover:opacity-90">
  <div className="relative w-14 h-14 saturate-125">
    <Image
      src="/gamingblinds_0003_closeup.jpg-Photoroom.png"
      alt="Gaming devices symbol"
      fill
      className="object-contain"
      priority
    />
  </div>

  <div>
    <h1 className="text-4xl font-black tracking-tight">
      Playlog
    </h1>
    <p className="text-gray-400 text-sm">
      Log, rate, and remember the games you play.
    </p>
  </div>
</Link>


        {/* Center: Navigation (logged in only) */}
        <nav className="flex items-center gap-3">
          {session?.user && (
            <>
              <Link href="/search">
                <Button size="sm">Explore</Button>
              </Link>

              <Link href="/lists">
                <Button size="sm" variant="secondary">
                  Lists
                </Button>
              </Link>

              {favoritesList && (
                <Link href={`/lists/${favoritesList.id}`}>
                  <Button size="sm" variant="secondary">
                    Favorites
                  </Button>
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link
                href="/profile"
                className="text-sm text-gray-400 hover:text-gray-200 hover:underline inline-flex items-center h-9"
              >
                {session.user.name}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/search">
                <Button size="sm">Explore</Button>
              </Link>

              <Link href="/api/auth/signin">
                <Button size="sm" variant="secondary">
                  Log in
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {[
        { title: "🆕 Recently Added", games: recentlyAdded },
        { title: "⭐ Top Favorited", games: topFavorited },
      ].map((section) => (
        <section key={section.title} className="space-y-4">
          <h2 className="text-xl font-bold">{section.title}</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {section.games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.igdbId}`}
                className="min-w-[160px] aspect-square border-2 border-black bg-[#1f2328] relative"
              >
                {game.coverUrl ? (
                  <Image
                    src={`https:${game.coverUrl}`}
                    alt={game.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 text-center p-2">
                    {game.title}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="space-y-4">
        <h2 className="text-xl font-bold">❤️ Recently Favorited</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {recentlyFavorited.map(({ game }) => (
            <Link
              key={game.id}
              href={`/games/${game.igdbId}`}
              className="min-w-[160px] aspect-square border-2 border-black bg-[#1f2328] relative"
            >
              {game.coverUrl ? (
                <Image
                  src={`https:${game.coverUrl}`}
                  alt={game.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 text-center p-2">
                  {game.title}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">🎯 Editor’s Picks</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {editorsPicks.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.igdbId}`}
              className="min-w-[160px] aspect-square border-2 border-black bg-[#1f2328] relative"
            >
              {game.coverUrl ? (
                <Image
                  src={`https:${game.coverUrl}`}
                  alt={game.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 text-center p-2">
                  {game.title}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
