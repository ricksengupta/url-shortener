"use client";

import { useTransition } from "react";
import { deleteUrl } from "@/app/actions/url";

type Props = {
  id: string;
};

export default function DeleteButton({ id }: Props) {
  const [isPending, startTransition] = useTransition(); 
  
  //?What is useTransition? Think about deleting. deleting takes time. during that time should the button still be clickable?
  //?Deleting is a background operation.React can keep the UI responsive while it happens.

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this URL?"
    );

    if (!confirmed) return;

    startTransition(async () => {
      await deleteUrl(id);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}