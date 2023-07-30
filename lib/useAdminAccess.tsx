import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const useAdminAccess = () => {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!session?.user || !session.user.isAdmin ) {
      router.push('/');
    }
  }, [session, router]);

  return session?.user?.isAdmin;
};

export default useAdminAccess;
