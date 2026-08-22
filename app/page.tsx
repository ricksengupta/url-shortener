import { Show, UserButton } from "@clerk/nextjs";
import { createShortUrl } from "./actions/url";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent"
        >
          URLify
        </Link>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <a
              href="/sign-in"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Sign In
            </a>
          </Show>

          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-gray-50"
            >
              Dashboard
            </Link>

            <UserButton />
          </Show>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-20 text-center">
        <div className="mb-6 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          Simple URL shortening & analytics
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
          Shorten your links.
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Understand your audience.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Create clean, shareable short URLs and track clicks,
          browsers, devices, operating systems, and more from
          one simple dashboard.
        </p>

        {/* URL Form */}
        <div className="mt-10 w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
          <form
            action={createShortUrl}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="url"
              name="originalUrl"
              placeholder="Paste your long URL here..."
              required
              className="flex-1 rounded-xl border border-gray-200 px-5 py-4 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-4 font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-purple-700"
            >
              Shorten URL
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-16 grid w-full gap-6 text-left md:grid-cols-3">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
            <div className="mb-4 text-2xl">🔗</div>

            <h2 className="text-lg font-semibold text-gray-900">
              Short Links
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Turn long and complicated URLs into clean,
              easy-to-share links.
            </p>
          </div>

          <div className="rounded-xl border border-purple-100 bg-purple-50 p-6">
            <div className="mb-4 text-2xl">📊</div>

            <h2 className="text-lg font-semibold text-gray-900">
              Analytics
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Track clicks and understand how people interact
              with your links.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6">
            <div className="mb-4 text-2xl">📱</div>

            <h2 className="text-lg font-semibold text-gray-900">
              QR Codes
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Generate QR codes for your shortened URLs and
              share them anywhere.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}