import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { deleteSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  await deleteSession();

  revalidatePath('/');

  return NextResponse.redirect(new URL('/login', request.nextUrl));
}
