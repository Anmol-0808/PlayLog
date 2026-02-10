import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getOrCreateFavoritesList } from "@/lib/favorites";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { gameId, title, coverUrl } = await req.json();

  if (!gameId || !title) {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: 400 }
    );
  }

  const favorites = await getOrCreateFavoritesList(
    session.user.id
  );

  if (favorites.items.length >= 4) {
    return NextResponse.json(
      { error: "Favorites list is full" },
      { status: 400 }
    );
  }

  const game = await prisma.game.upsert({
    where: { igdbId: gameId },
    update: { title, coverUrl },
    create: {
      igdbId: gameId,
      title,
      coverUrl,
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

  return NextResponse.json({ success: true });
}
