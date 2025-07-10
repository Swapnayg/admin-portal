import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getSessionUser() {
  const token = (await cookies()).get('token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      name: string;
      email: string;
      role: string;
    };
    return decoded;
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
}
