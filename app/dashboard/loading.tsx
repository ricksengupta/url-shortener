export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="h-9 w-40 animate-pulse rounded-lg bg-gray-200" />

        <div className="flex gap-3">
          <div className="h-10 w-40 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">

        <div className="h-32 animate-pulse rounded-xl bg-white shadow-sm" />

        <div className="h-32 animate-pulse rounded-xl bg-white shadow-sm" />

        <div className="h-32 animate-pulse rounded-xl bg-white shadow-sm" />

      </div>

      {/* URL cards */}
      <div className="space-y-4">

        <div className="h-32 animate-pulse rounded-xl bg-white shadow-sm" />

        <div className="h-32 animate-pulse rounded-xl bg-white shadow-sm" />

        <div className="h-32 animate-pulse rounded-xl bg-white shadow-sm" />

      </div>

    </main>
  );
}