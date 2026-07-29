import { Suspense } from "react";
import AuthForm from "../components/AuthForm";
import UserProfile from "../components/UserProfile";
import { getUserProfile, getUserOrders, getUserAddresses } from "../actions/user-actions";

export const metadata = {
  title: "My Account | Thar Delight",
  description: "Manage your Thar Delight account",
};

export default async function AccountPage() {
  const user = await getUserProfile();

  if (!user) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-brand-warm-white flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-sand border-t-brand-gold rounded-full animate-spin" />
        </div>
      }>
        <AuthForm />
      </Suspense>
    );
  }

  const [orders, addresses] = await Promise.all([
    getUserOrders(),
    getUserAddresses()
  ]);

  return <UserProfile user={user} orders={orders} addresses={addresses} />;
}

