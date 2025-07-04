'use client';

import {Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'slate.100',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h1" fontWeight={700} color="slate.800">
        404
      </Typography>
      <Typography variant="h5" color="slate.600" gutterBottom>
        Page Not Found
      </Typography>
      <Typography color="slate.500" mb={3}>
        Sorry, the page you're looking for doesn't exist.
      </Typography>

      <Button variant="contained" size="small" component={Link} href="/" sx={{ backgroundColor: '#0f172a', color: 'white',
        fontWeight: 600, textTransform: 'none', px: 2.5, py: 1, borderRadius: 2, boxShadow: 'none', '&:hover': { backgroundColor: '#1e293b', },}}>
          Get insights
      </Button>
    </Box>
  );
}
