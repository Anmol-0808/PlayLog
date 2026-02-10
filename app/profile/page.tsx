import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getOrCreateFavoritesList } from "@/lib/favorites";
import Image from "next/image";
import Link from "next/link";
import BackToHome from "@/components/BackToHome";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="p-8">
        <p>You must be logged in to view this page.</p>
      </main>
    );
  }

  const [
    activities,
    reviewsCount,
    listsCount,
    playedCount,
    favorites,
  ] = await Promise.all([
    prisma.userGameStatus.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { game: true },
    }),
    prisma.review.count({
      where: { userId: session.user.id },
    }),
    prisma.list.count({
      where: { userId: session.user.id },
    }),
    prisma.userGameStatus.count({
      where: {
        userId: session.user.id,
        status: "PLAYED",
      },
    }),
    getOrCreateFavoritesList(session.user.id),
  ]);

  return (
  <main className="min-h-screen bg-[#14181c] text-gray-200 p-8">
    <BackToHome />

    <div className="max-w-5xl mx-auto space-y-12">


        <section className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-black bg-[#1f2328]">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "Profile"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-black">
                {session.user.name?.[0] ?? "U"}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-black">
              {session.user.name ?? "You"}
            </h1>
            <p className="text-sm text-gray-400">
              Am here. Was Always here!
            </p>
          </div>
        </section>

        <section className="flex gap-12 text-sm border-t border-b border-black py-4">
  <div>
    <span className="font-bold">{playedCount}</span>{" "}
    <span className="text-gray-400">played</span>
  </div>

  <div>
    <span className="font-bold">{reviewsCount}</span>{" "}
    <span className="text-gray-400">reviews</span>
  </div>

  <Link
    href="/lists"
    className="hover:underline"
  >
    <span className="font-bold">{listsCount}</span>{" "}
    <span className="text-gray-400">lists</span>
  </Link>
</section>


        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-wide text-gray-400">
            Favorite games
          </h2>

          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => {
              const item = favorites.items[i];

              if (!item) {
                return (
                  <div
                    key={i}
                    className="aspect-square border-2 border-dashed border-black bg-[#1f2328]"
                  />
                );
              }

              return (
                <Link
                  key={item.id}
                  href={`/games/${item.game.igdbId}`}
                  className="block aspect-square relative border-2 border-black bg-[#1f2328] hover:opacity-90"
                >
                  {item.game.coverUrl ? (
                    <Image
                      src={`https:${item.game.coverUrl}`}
                      alt={item.game.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 p-2 text-center">
                      {item.game.title}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-wide text-gray-400">
            Recent activity
          </h2>

          {activities.length === 0 && (
            <p className="text-gray-500">
              You haven’t logged any activity yet.
            </p>
          )}

          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex justify-between text-sm"
            >
              <p className="text-gray-300">
                {activity.status === "PLAYING" &&
                  "Started playing "}
                {activity.status === "PLAYED" &&
                  "Marked as played "}
                {activity.status === "WISHLIST" &&
                  "Added to wishlist "}
                <Link
                  href={`/games/${activity.game.igdbId}`}
                  className="underline hover:text-white"
                >
                  {activity.game.title}
                </Link>
              </p>

              <span className="text-gray-500">
                {activity.createdAt.toLocaleDateString()}
              </span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
