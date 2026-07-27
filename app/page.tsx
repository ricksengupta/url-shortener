import { createShortUrl } from "@/app/actions/url";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        action={createShortUrl}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="url"
          name="originalUrl"
          placeholder="https://example.com"
          className="border rounded-lg p-3"
          required
        />

        <button
          type="submit"
          className="bg-black text-white rounded-lg p-3"
        >
          Shorten URL
        </button>
      </form>
    </main>
  );
}