import { getAdminContactMessages } from "@/app/actions/admin-actions";
import AdminMessagesClient from "./AdminMessagesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Messages Admin — Thar Delight",
};

export default async function AdminMessages() {
  const messages = await getAdminContactMessages();

  return <AdminMessagesClient initialMessages={messages} />;
}
