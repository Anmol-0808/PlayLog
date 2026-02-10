"use client";

import { useTransition } from "react";
import { removeFromList } from "@/app/actions/lists";

type Props = {
  listItemId: string;
  listId: string;
};

export default function RemoveFromListButton({
  listItemId,
  listId,
}: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(() => {
          removeFromList(listItemId, listId);
        })
      }
      className="absolute top-1 right-1 z-10 bg-black/70 text-white text-xs px-2 py-1 border border-black hover:bg-red-600 disabled:opacity-50"
    >
      {isPending ? "..." : "✕"}
    </button>
  );
}
