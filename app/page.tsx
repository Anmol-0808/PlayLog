"use client";

import { useSession, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="min-h-screen bg-[#14181c] text-gray-200 p-8 space-y-10">
      <h1 className="text-5xl font-black tracking-tight">Playlog</h1>

      {status === "loading" && <p>Checking session...</p>}

      {status === "unauthenticated" && (
        <Card>
          <CardContent>
            <p className="text-red-400 font-semibold">Not logged in</p>
          </CardContent>
        </Card>
      )}

      {status === "authenticated" && (
        <Card>
          <CardContent className="space-y-4">
            <p className="font-semibold">Logged in as</p>
            <p className="text-lg">{session.user?.name}</p>
            <p className="text-sm text-gray-400">{session.user?.email}</p>

            <Button variant="destructive" onClick={() => signOut()}>
              Logout
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-4">
          <Badge>Prototype</Badge>

          <p className="text-lg text-gray-300">
            Log, rate, and remember the games you play.
          </p>

          <Button>Explore</Button>
        </CardContent>
      </Card>
    </main>
  );
}
