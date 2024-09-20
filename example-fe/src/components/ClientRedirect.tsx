'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClientRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin');
  }, [router]);

  return <></>;

  /*return session ? (
    <Link href="/admin" passHref legacyBehavior>
      <Button>Entra</Button>
    </Link>
  ) : (
    <AuthStatus />
  );*/
}
