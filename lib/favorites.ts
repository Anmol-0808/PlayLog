import { prisma } from "@/lib/prisma";

export async function getOrCreateFavoritesList(
  userId: string
) {
  let favorites = await prisma.list.findFirst({
    where: {
      userId,
      type: "FAVORITES",
    },
    include: {
      items: {
        include: { game: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!favorites) {
    favorites = await prisma.list.create({
      data: {
        name: "Favorite Games",
        type: "FAVORITES",
        userId,
      },
      include: {
        items: {
          include: { game: true },
        },
      },
    });
  }

  return favorites;
}
