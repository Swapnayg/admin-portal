// lib/withRole.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export function withRole(
  allowedRoles: string[],
  handler: (req: NextRequest, user: DecodedToken) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get('authorization') || '';

      const token = authHeader.replace('Bearer ', '');

      if (!token) {
        return NextResponse.json({ message: 'No token provided' }, { status: 401 });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

      if (!allowedRoles.includes(decoded.role)) {
        return NextResponse.json({ message: 'Access Denied' }, { status: 403 });
      }

      return handler(req, decoded);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  };
}
