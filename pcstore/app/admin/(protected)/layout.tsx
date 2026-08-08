import type { Metadata } from "next";
import { getSessionEmail } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin — PCStore",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const email = await getSessionEmail();

  return (
    <div className="grid lg:grid-cols-[230px_1fr] min-h-screen">
      <AdminSidebar email={email ?? ""} />
      <main className="px-[5%] lg:px-10 py-8 pb-14 min-w-0">{children}</main>
    </div>
  );
}
