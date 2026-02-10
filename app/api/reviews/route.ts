import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { gameId, rating, text } = await req.json();

  if (!gameId || typeof gameId !== "number") {
    return NextResponse.json({ error: "Invalid gameId" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5" },
      { status: 400 }
    );
  }


  const game = await prisma.game.upsert({
    where: { igdbId: gameId },
    update: {},
    create: {
      igdbId: gameId,
      title: "Unknown",
    },
  });

  const review = await prisma.review.upsert({
    where: {
      userId_gameId: {
        userId: session.user.id,
        gameId: game.id,
      },
    },
    update: {
      rating,
      text,
    },
    create: {
      rating,
      text,
      userId: session.user.id,
      gameId: game.id,
    },
  });

  return NextResponse.json(review);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const igdbId = Number(searchParams.get("igdbId"));

  if (!igdbId || Number.isNaN(igdbId)) {
    return NextResponse.json(
      { error: "Invalid igdbId" },
      { status: 400 }
    );
  }

  const game = await prisma.game.findUnique({
    where: { igdbId },
  });

  if (!game) {
    return NextResponse.json({
      averageRating: null,
      count: 0,
      reviews: [],
    });
  }

  const stats = await prisma.review.aggregate({
    where: { gameId: game.id },
    _avg: { rating: true },
    _count: true,
  });

  const reviews = await prisma.review.findMany({
    where: { gameId: game.id },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json({
    averageRating: stats._avg.rating,
    count: stats._count,
    reviews,
  });
}
