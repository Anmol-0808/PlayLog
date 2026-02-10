import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RemoveFromListButton from "@/components/lists/RemoveFromListButton";

type Props = {
  params: {
    id: string;
  };
};

export default async function ListPage({ params }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="p-8">
        <p>You must be logged in to view this list.</p>
      </main>
    );
  }

  const list = await prisma.list.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
        include: {
          game: true,
        },
      },
    },
  });

  if (!list) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#14181c] text-gray-200 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-black flex items-center gap-2">
            {list.type === "FAVORITES" && <span>⭐</span>}
            {list.name}
          </h1>

          {list.description && (
            <p className="text-gray-400">
              {list.description}
            </p>
          )}

          <p className="text-sm text-gray-500">
            {list.items.length} games
          </p>
        </header>

        {list.items.length === 0 && (
          <p className="text-gray-400">
            This list is empty.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {list.items.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square border-2 border-black bg-[#1f2328]"
            >
              <RemoveFromListButton
                listItemId={item.id}
                listId={list.id}
              />

              <Link
                href={`/games/${item.game.igdbId}`}
                className="block w-full h-full hover:opacity-90"
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
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
