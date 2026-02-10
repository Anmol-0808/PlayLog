import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { listId, gameId, title } = await req.json();

  if (!listId || !gameId || !title) {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: 400 }
    );
  }

  const list = await prisma.list.findFirst({
    where: {
      id: listId,
      userId: session.user.id,
    },
  });

  if (!list) {
    return NextResponse.json(
      { error: "List not found" },
      { status: 404 }
    );
  }

  const game = await prisma.game.upsert({
    where: { igdbId: gameId },
    update: { title },
    create: {
      igdbId: gameId,
      title,
    },
  });

  const item = await prisma.listItem.upsert({
    where: {
      listId_gameId: {
        listId: list.id,
        gameId: game.id,
      },
    },
    update: {},
    create: {
      listId: list.id,
      gameId: game.id,
    },
  });

  return NextResponse.json(item);
}
