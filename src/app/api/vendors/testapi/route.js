// app/api/test-auth/route.ts
import { NextResponse } from 'next/server';
import { auth } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const userList = await auth.listUsers(1); // just 1 user
    return NextResponse.json({ message: 'Firebase working', userCount: userList.users.length });
  } catch (err) {
    console.error('[AUTH ERROR]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
