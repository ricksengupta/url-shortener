import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="mt-4">Welcome!</p>

      <p>Your Clerk User ID:</p>

      <code className="mt-2 block rounded bg-gray-100 p-3">
        {userId}
      </code>
    </main>
  );
}