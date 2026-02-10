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

  const { listId, gameId } = await req.json();

  if (!listId || !gameId) {
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

  await prisma.listItem.deleteMany({
    where: {
      listId,
      game: {
        igdbId: gameId,
      },
    },
  });

  return NextResponse.json({ success: true });
}
