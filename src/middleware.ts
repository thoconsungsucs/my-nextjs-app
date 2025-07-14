import { NextRequest, NextResponse } from 'next/server';

import { getSession } from '@/lib/session';

export default async function middleware(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};
