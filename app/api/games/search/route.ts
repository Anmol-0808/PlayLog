import { NextResponse } from "next/server";
import { getIGDBAccessToken } from "@/lib/igdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Missing search query" },
      { status: 400 }
    );
  }

  const accessToken = await getIGDBAccessToken();

  const igdbResponse = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    },
    body: `
      search "${query}";
      fields id, name, cover.url, platforms.name;
      limit 10;
    `,
  });

  if (!igdbResponse.ok) {
    return NextResponse.json(
      { error: "Failed to fetch games from IGDB" },
      { status: 500 }
    );
  }

  const games = await igdbResponse.json();

  return NextResponse.json(games);
}
