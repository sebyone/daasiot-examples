'use client';

import AuthStatus from '@/components/authStatus';
import { Button } from 'antd';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClientRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/admin');
    }
  }, [session, router]);

  if (status === 'loading') {
    return <div>Caricamento...</div>;
  }

  /*return session ? (
    <Link href="/admin" passHref legacyBehavior>
      <Button>Entra</Button>
    </Link>
  ) : (
    <AuthStatus />
  );*/
}
