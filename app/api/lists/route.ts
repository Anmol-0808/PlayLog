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

  const { name, description } = await req.json();

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "List name is required" },
      { status: 400 }
    );
  }

  const list = await prisma.list.create({
    data: {
      name,
      description,
      userId: session.user.id,
    },
  });

  return NextResponse.json(list);
}
