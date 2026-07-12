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
    return <AuthForm />;
  }

  const [orders, addresses] = await Promise.all([
    getUserOrders(),
    getUserAddresses()
  ]);

  return <UserProfile user={user} orders={orders} addresses={addresses} />;
}
