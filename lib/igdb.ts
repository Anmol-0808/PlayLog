export const runtime = "nodejs";

const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";


export async function getIGDBAccessToken() {
  const res = await fetch(TWITCH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      grant_type: "client_credentials",
    }),
  });

  const text = await res.text();


  if (!res.ok) {
    throw new Error("Failed to get IGDB access token");
  }

  const data = JSON.parse(text);
  return data.access_token as string;
}
