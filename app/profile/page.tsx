"use client";
export const runtime = "nodejs";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { status, data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="p-8">Checking access...</p>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-3xl font-black">Profile</h1>

      <p>Welcome, {session.user?.name}</p>
      <p className="text-sm text-gray-600">{session.user?.email}</p>

      <p className="text-sm">
        This page is client-protected.
      </p>
    </main>
  );
}
