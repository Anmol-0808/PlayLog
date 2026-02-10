import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BackToHome() {
  return (
    <Link href="/">
      <Button
        size="sm"
        variant="secondary"
        className="mb-4"
      >
        ← Back to Home
      </Button>
    </Link>
  );
}
