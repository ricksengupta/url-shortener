import CopyButton from "./CopyButton";
import DeleteButton from "./DeleteButton";
import Link from "next/link";
import QRButton from "./QRButton";

type Props = {
  url: {
    id: string;
    originalUrl: string;
    shortCode: string;
    clickCount: number;
    createdAt: Date;
  };
};

export default function UrlCard({ url }: Props) {
  const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/${url.shortCode}`;

  return (
    <div className="group rounded-xl border border-slate-200 bg-white/90 p-4 shadow-md backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6">

      {/* Original URL */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-500">
          Original URL
        </p>

        <p className="mt-1 break-all font-medium text-blue-600">
          {url.originalUrl}
        </p>
      </div>

      {/* Short URL */}
      <div className="mt-5 min-w-0">
        <p className="text-sm font-semibold text-purple-600">
          Short URL
        </p>

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={`/${url.shortCode}`}
            target="_blank"
            className="break-all font-medium text-blue-600 hover:text-blue-800"
          >
            {shortUrl}
          </Link>

          <CopyButton text={shortUrl} />
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:flex sm:flex-wrap sm:gap-6">
        <div>
          <p className="text-gray-500">
            Clicks
          </p>

          <p className="font-semibold">
            {url.clickCount}
          </p>
        </div>

        <div>
          <p className="text-gray-500">
            Created
          </p>

          <p className="font-semibold">
            {url.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">

        <QRButton url={shortUrl} />

        <Link
          href={`/dashboard/analytics/${url.id}`}
          className="rounded-lg bg-purple-100 px-4 py-2 text-center text-sm font-medium text-purple-700 transition hover:bg-purple-200"
        >
          Analytics
        </Link>

        <DeleteButton id={url.id} />
      </div>
    </div>
  );
}