import { requireAdmin } from "@/lib/requireAdmin";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  try {
    // SECURITY FIX: This single check securely protects EVERY page 
    // inside the /admin-controls directory. No unauthenticated user 
    // can ever access the dashboard or any of its subpages.
    await requireAdmin();
  } catch (error) {
    // If they aren't logged in or aren't an admin, kick them out to the homepage
    redirect("/");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
