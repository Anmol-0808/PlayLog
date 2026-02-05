import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ServerProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-3xl font-black">Server Profile</h1>

      <p>Welcome, {session.user?.name}</p>
      <p className="text-sm text-gray-600">{session.user?.email}</p>

      <p className="text-sm text-green-600">
        This page is server-protected.
      </p>
    </main>
  );
}
