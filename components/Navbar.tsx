import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent sm:text-2xl"
        >
          justshortURL
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1 sm:gap-3">

          <Link
            href="/dashboard"
            className="rounded-lg px-2 py-2 text-xs font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 sm:px-3 sm:text-sm"
          >
            Dashboard
          </Link>

          <Link
            href="/"
            className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-2.5 py-2 text-xs font-medium text-white shadow-sm transition hover:opacity-90 sm:px-4 sm:text-sm"
          >
            Create URL
          </Link>

          <UserButton />
        </div>
      </div>
    </nav>
  );
}