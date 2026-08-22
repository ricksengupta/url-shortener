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
  const shortUrl = `http://localhost:3000/${url.shortCode}`;

  return (
    <div className="group rounded-xl border border-slate-200 bg-white/90 p-6 shadow-md backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">

      {/* Original URL */}
      <div>
        <p className="text-sm font-semibold text-gray-500">
          Original URL
        </p>

        <p className="break-all font-medium text-blue-600 hover:text-blue-800">
          {url.originalUrl}
        </p>
      </div>

      {/* Short URL */}
      <div className="mt-5">
        <p className="text-sm font-semibold text-purple-600">
          Short URL
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
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
      <div className="mt-5 flex flex-wrap gap-6 text-sm">
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
      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <QRButton url={shortUrl} />

        <Link
          href={`/dashboard/analytics/${url.id}`}
          className="rounded-lg bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-200"
        >
          Analytics
        </Link>

        <DeleteButton id={url.id} />
      </div>
    </div>
  );
}