import { requireAdmin } from "@/lib/requireAdmin";
import { notFound } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  try {
    await requireAdmin();
  } catch (error) {
    notFound();
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

