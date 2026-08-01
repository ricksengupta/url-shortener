"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type Props = {
  url: string;
};

export default function QRButton({ url }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded border px-3 py-1"
      >
        QR
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">
              QR Code
            </h2>

            <QRCodeSVG
              value={url}
              size={200}
            />

            <p className="mt-4 break-all text-sm text-gray-600">
              {url}
            </p>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}