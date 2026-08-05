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
  return (
    <div className="rounded-lg border p-5 shadow-sm">

      <p>
        <span className="font-semibold">
          Original URL:
        </span>{" "}
        {url.originalUrl}
      </p>

      <div className="flex items-center gap-3">
        <span className="font-semibold">
          Short URL:
        </span>

        <Link
          href={`/${url.shortCode}`}
          target="_blank"
          className="text-blue-600 underline hover:text-blue-800"
        >
          http://localhost:3000/{url.shortCode}
        </Link>

        <CopyButton
          text={`http://localhost:3000/${url.shortCode}`}
        />
      </div>

      <p>
        <span className="font-semibold">
          Clicks:
        </span>{" "}
        {url.clickCount}
      </p>

      <p className="text-sm text-gray-500">
        Created: {url.createdAt.toLocaleDateString()}
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <QRButton
          url={`http://localhost:3000/${url.shortCode}`}
        />

        <Link
          href={`/dashboard/analytics/${url.id}`}
          className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
        >
          Analytics
        </Link>

        <DeleteButton id={url.id} />
      </div>

    </div>
  );
}