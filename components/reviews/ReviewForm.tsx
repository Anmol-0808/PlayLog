"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ReviewFormProps = {
  gameId: number;
  initialReview: {
    rating: number;
    text: string | null;
  } | null;
};


export default function ReviewForm({
  gameId,
  initialReview,
}: ReviewFormProps) {
  const [rating, setRating] = useState<number | "">(
    initialReview?.rating ?? ""
  );
  const [text, setText] = useState(initialReview?.text ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const isDirty =
    rating !== (initialReview?.rating ?? "") ||
    text !== (initialReview?.text ?? "");

  async function handleSubmit() {
    if (!rating) return;

    setIsSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          rating,
          text,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save review");
      }

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-black">Your Review</h2>

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="bg-[#14181c] border-2 border-black p-2 text-gray-200"
        >
          <option value="">Rate (1–5)</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your thoughts..."
          className="bg-[#14181c] border-2 border-black p-3 text-gray-200 w-full"
          rows={4}
        />

        <Button
          onClick={handleSubmit}
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : initialReview
            ? "Update Review"
            : "Submit Review"}
        </Button>

        {status === "success" && (
          <p className="text-sm text-green-400">
            Review saved successfully.
          </p>
        )}

        {status === "error" && (
          <p className="text-sm text-red-400">
            Something went wrong. Try again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
