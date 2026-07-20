import { getNewsletterSubscribers } from "@/app/actions/admin-actions";
import AdminSubscribersClient from "./AdminSubscribersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Subscribers Admin — Thar Delight",
};

export default async function AdminSubscribers() {
  const subscribers = await getNewsletterSubscribers();

  return <AdminSubscribersClient initialSubscribers={subscribers} />;
}
