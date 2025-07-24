import { withRoleApi } from '@/lib/withRoleApi';

const handler = (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Access user injected by withRoleApi
  res.status(200).json({
    message: 'GET Access granted!',
    user: req.user,
  });
};

export default withRoleApi(handler, ['VENDOR']);
