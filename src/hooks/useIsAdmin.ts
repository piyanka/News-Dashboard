import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const ADMINS = ["yadavpriyanka97181019@gmail.com", "admin@example.com"];

export default function useIsAdmin() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const isDemo = searchParams.get("demo") === "true";
  const userEmail = session?.user?.email;

  return isDemo || (userEmail ? ADMINS.includes(userEmail) : false);
}
