import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const useAdminAccess = () => {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session && !session.user.isAdmin) {
      router.push("/");
    }
  }, [session, router]);

  return session?.user?.isAdmin;
};

export const useUserOnlyAccess = () => {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.user?.isAdmin) {
      router.push("/admin/teams");
    }
  }, [session, router]);

  return session?.user;
};
