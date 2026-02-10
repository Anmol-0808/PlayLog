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

  const { gameId, status, title, coverUrl } = await req.json();

  if (
    !gameId ||
    !title ||
    !["PLAYED", "PLAYING", "WISHLIST"].includes(status)
  ) {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: 400 }
    );
  }


  const game = await prisma.game.upsert({
    where: { igdbId: gameId },
    update: {
      title,
      coverUrl,
    },
    create: {
      igdbId: gameId,
      title,
      coverUrl,
    },
  });

  const userGameStatus = await prisma.userGameStatus.upsert({
    where: {
      userId_gameId: {
        userId: session.user.id,
        gameId: game.id,
      },
    },
    update: {
      status,
    },
    create: {
      status,
      userId: session.user.id,
      gameId: game.id,
    },
  });

  return NextResponse.json(userGameStatus);
}
