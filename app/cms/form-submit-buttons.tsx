"use client";

import { useFormStatus } from "react-dom";

export function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl border border-white/20 bg-white/[0.03] px-4 py-2 text-sm text-muted transition hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Logging out..." : "Logout"}
    </button>
  );
}

export function ApplicationStatusSubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="rounded-lg border border-green/25 bg-green/10 px-2 py-1.5 text-xs font-semibold text-green transition hover:bg-green/15 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
}
