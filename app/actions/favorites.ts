"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getOrCreateFavoritesList } from "@/lib/favorites";

export async function addToFavorites({
  gameId,
  title,
  coverUrl,
}: {
  gameId: number;
  title: string;
  coverUrl?: string | null;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const favorites = await getOrCreateFavoritesList(
    session.user.id
  );

  if (favorites.items.length >= 4) {
    throw new Error("Favorites full");
  }

  const normalizedCover =
  coverUrl && coverUrl.includes("t_")
    ? coverUrl.replace(/t_[^/]+/, "t_cover_big")
    : coverUrl ?? null;

const game = await prisma.game.upsert({
  where: { igdbId: gameId },
  update: {
    title,
    ...(normalizedCover && { coverUrl: normalizedCover }),
  },
  create: {
    igdbId: gameId,
    title,
    coverUrl: normalizedCover,
  },
});

  await prisma.listItem.upsert({
    where: {
      listId_gameId: {
        listId: favorites.id,
        gameId: game.id,
      },
    },
    update: {},
    create: {
      listId: favorites.id,
      gameId: game.id,
    },
  });
}
