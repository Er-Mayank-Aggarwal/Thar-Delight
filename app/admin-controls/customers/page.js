import { getAdminCustomers } from "@/app/actions/admin-actions";
import AdminCustomersClient from "./AdminCustomersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customers Admin — Thar Delight",
};

export default async function AdminCustomers() {
  const customers = await getAdminCustomers();

  return <AdminCustomersClient initialCustomers={customers} />;
}
