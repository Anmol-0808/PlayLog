import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await prisma.user.findFirst({
  where: { id: params.id },
  include: {
    reviews: {
      orderBy: { createdAt: "desc" },
      include: {
        game: true,
      },
    },
  },
});


  if (!user) {
    return (
      <main className="p-8">
        <p>User not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#14181c] text-gray-200 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <section className="space-y-1">
          <h1 className="text-4xl font-black">
            {user.name ?? "Anonymous User"}
          </h1>

          <p className="text-sm text-gray-400">
            {user.reviews.length} review
            {user.reviews.length !== 1 && "s"}
          </p>
        </section>

        {/* Reviews */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black">
            Reviews
          </h2>

          {user.reviews.length === 0 && (
            <p className="text-gray-400">
              This user hasn’t reviewed any games yet.
            </p>
          )}

          {user.reviews.map((review) => (
            <div
              key={review.id}
              className="border-2 border-black bg-[#1f2328] p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <Link
                  href={`/games/${review.game.igdbId}`}
                  className="font-semibold hover:underline"
                >
                  {review.game.title}
                </Link>

                <span className="text-sm text-gray-400">
                  ⭐ {review.rating}
                </span>
              </div>

              {review.text && (
                <p className="text-gray-200">
                  {review.text}
                </p>
              )}

              <p className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
