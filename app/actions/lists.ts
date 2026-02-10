"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function removeFromList(listItemId: string, listId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const item = await prisma.listItem.findFirst({
    where: {
      id: listItemId,
      list: {
        userId: session.user.id,
      },
    },
  });

  if (!item) {
    throw new Error("Item not found or access denied");
  }

  await prisma.listItem.delete({
    where: { id: listItemId },
  });

  
  revalidatePath(`/lists/${listId}`);
}
