import CheckoutClient from "./CheckoutClient";
import { getUserProfile, getUserAddresses } from "../actions/user-actions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Checkout — Thar Delight",
  description: "Complete your purchase.",
};

export default async function CheckoutPage() {
  const [profile, addresses] = await Promise.all([
    getUserProfile(),
    getUserAddresses()
  ]);

  if (!profile) {
    redirect("/account");
  }

  return <CheckoutClient initialProfile={profile} initialAddresses={addresses} />;
}
