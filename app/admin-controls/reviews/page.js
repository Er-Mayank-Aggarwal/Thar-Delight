import { getAdminReviews } from "@/app/actions/admin-actions";
import AdminReviewsClient from "./AdminReviewsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reviews Admin — Thar Delight",
};

export default async function AdminReviews() {
  const reviews = await getAdminReviews();

  return <AdminReviewsClient initialReviews={reviews} />;
}
