import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import BackToHome from "@/components/BackToHome";

export default async function ListsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="p-8">
        <p>You must be logged in to view your lists.</p>
      </main>
    );
  }

  const lists = await prisma.list.findMany({
  where: {
    userId: session.user.id,
  },
  include: {
    items: {
      take: 4,
      orderBy: { createdAt: "asc" },
      include: {
        game: true,
      },
    },
    _count: {
      select: { items: true },
    },
  },
  orderBy: [
    { type: "asc" }, 
    { createdAt: "desc" },
  ],
});


  return (
  <main className="min-h-screen bg-[#14181c] text-gray-200 p-8">
    <BackToHome />

    <div className="max-w-5xl mx-auto space-y-8">

        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-black">Your Lists</h1>
        </header>

        {lists.length === 0 && (
          <p className="text-gray-400">
            You haven’t created any lists yet.
          </p>
        )}

        <div className="grid gap-6">
          {lists.map((list) => (
            <Link
              key={list.id}
              href={`/lists/${list.id}`}
              className="block border-2 border-black bg-[#1f2328] p-4 hover:opacity-90"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    {list.type === "FAVORITES" && <span>⭐</span>}
                    {list.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {list._count.items} games
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => {
                  const item = list.items[i];

                  if (!item) {
                    return (
                      <div
                        key={i}
                        className="aspect-square border-2 border-dashed border-black bg-[#14181c]"
                      />
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      className="aspect-square relative border-2 border-black bg-[#14181c]"
                    >
                      {item.game.coverUrl ? (
                        <Image
  src={
    item.game.coverUrl.startsWith("http")
      ? item.game.coverUrl
      : `https:${item.game.coverUrl}`
  }
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
                    </div>
                  );
                })}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
