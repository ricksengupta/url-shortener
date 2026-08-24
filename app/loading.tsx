export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="flex flex-col items-center text-center">

        {/* Logo */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
          justshortURL
        </div>

        {/* Spinner */}
        <div className="mt-8 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

        <p className="mt-4 text-sm text-gray-500">
          Loading...
        </p>
      </div>
    </main>
  );
}