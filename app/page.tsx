import { Show, UserButton } from "@clerk/nextjs";
import { createShortUrl } from "./actions/url";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="mb-8 flex justify-end">
        <Show when="signed-out">
          <a
            href="/sign-in"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Sign In
          </a>
        </Show>

        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>

      <form action={createShortUrl} className="mx-auto flex max-w-2xl gap-4">
        <input
          type="url"
          name="originalUrl"
          placeholder="https://example.com"
          required
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          className="rounded-md bg-black px-6 py-2 text-white hover:bg-gray-800"
        >
          Shorten
        </button>
      </form>
    </main>
  );
}