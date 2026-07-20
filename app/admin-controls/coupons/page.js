import { getAllCoupons } from "@/app/actions/coupon-actions";
import AdminCouponsClient from "./AdminCouponsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Coupons Admin — Thar Delight",
};

export default async function AdminCoupons() {
  const coupons = await getAllCoupons();

  return <AdminCouponsClient initialCoupons={coupons} />;
}
