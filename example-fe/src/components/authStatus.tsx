'use client';
import { Button } from 'antd';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function AuthStatus() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status != 'loading' && session && session?.error === 'RefreshAccessTokenError') {
      signOut({ callbackUrl: '/' });
    }
  }, [session, status]);

  if (status == 'loading') {
    return <div className="my-3">Loading...</div>;
  } else if (session) {
    return (
      <div className="my-3">
        <span>{session.user.name}</span>{' '}
        <Button
          className="bg-blue-900 font-bold text-white py-1 px-2 rounded border border-gray-50"
          onClick={async () => {
            signOut({ callbackUrl: '/' });
          }}
        >
          Esci
        </Button>
      </div>
    );
  }

  return (
    <div className="my-3">
      <Button
        className="bg-blue-900 font-bold text-white py-1 px-2 rounded border border-gray-50"
        onClick={() => signIn('keycloak', { callbackUrl: '/admin/' })}
      >
        Accedi
      </Button>
    </div>
  );
}
