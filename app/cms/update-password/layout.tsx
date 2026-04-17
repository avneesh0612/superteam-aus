import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Password",
  description: "Secure password update page for CMS admin accounts.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UpdatePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
