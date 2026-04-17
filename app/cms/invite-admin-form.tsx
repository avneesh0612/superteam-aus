"use client";

import { useFormStatus } from "react-dom";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
};

function InviteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-xl border border-green/25 bg-green/15 px-4 py-2.5 text-sm font-semibold text-green transition hover:bg-green/25 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending..." : "Send Invite"}
    </button>
  );
}

export function InviteAdminForm({ action }: Props) {
  return (
    <form action={action} className="flex w-full max-w-xl flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap">
      <input
        type="email"
        name="email"
        required
        placeholder="new-admin@yourdomain.com"
        className="w-full min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm text-text outline-none ring-green/35 transition focus:ring-2 sm:min-w-[280px]"
      />
      <select
        name="role"
        defaultValue="content_admin"
        className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm text-text outline-none ring-green/35 transition focus:ring-2"
      >
        <option value="super_admin">Super Admin</option>
        <option value="content_admin">Content Admin</option>
        <option value="applications_admin">Applications Admin</option>
        <option value="viewer">Viewer</option>
      </select>
      <InviteSubmitButton />
    </form>
  );
}
