/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: ClientRedirect.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClientRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push(`/admin`);
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
