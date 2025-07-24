import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

interface AuthenticatedRequest extends NextApiRequest {
  user?: DecodedToken;
}

export function withRoleApi(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => void | Promise<void>,
  allowedRoles: string[]
): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access Denied' });
      }

      // Cast req to AuthenticatedRequest to add `user` field
      (req as AuthenticatedRequest).user = decoded;

      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}
