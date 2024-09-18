// import { isAuthenticated } from '@/Utils/Auth';
// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';

// const protectedRoutes = ['/admin'];

// export default function middleware(req: NextRequest) {
//   if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
//     const absoluteURL = new URL('/', req.nextUrl.origin);
//     return NextResponse.redirect(absoluteURL.toString());
//   }
// }

export { default } from 'next-auth/middleware';

const config = { matcher: ['/admin'] };
