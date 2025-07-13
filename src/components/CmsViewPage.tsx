'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Chip, CircularProgress, Alert, Paper } from '@mui/material';

interface Page {
  id: number;
  title: string;
  slug: string;
  status: string;
  content: string;
}

const statusStyles: Record<string, { label: string; sx: object }> = {
  PUBLISHED: {
    label: 'Published',
    sx: {
      backgroundColor: '#ede7f6', // light indigo/violet
      color: '#5e35b1',           // deep purple
    },
  },
  DRAFT: {
    label: 'Draft',
    sx: {
      backgroundColor: '#fce4ec', // soft pink
      color: '#d81b60',           // bold pink
    },
  },
  ARCHIVED: {
    label: 'Archived',
    sx: {
      backgroundColor: '#f3e5f5', // light purple
      color: '#8e24aa',           // purple
    },
  },
};


export default function CMSViewPage() {
  const { id } = useParams();

  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('No page ID provided');
      setLoading(false);
      return;
    }

    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/cms/get-page?id=${id}`);
        if (!res.ok) throw new Error('Failed to load page');
        const data = await res.json();
        setPage(data.page);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id]);

  if (loading) {
    return (
      <Box mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} width="100%">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!page) {
    return (
      <Box mt={4} width="100%">
        <Alert severity="warning">Page not found</Alert>
      </Box>
    );
  }

  return (
    <Box width="100%" maxWidth="900px" mt={4}>
      <Typography variant="h4" gutterBottom>
        {page.title}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        <strong>Slug:</strong> /{page.slug}
      </Typography>
      <Chip
        label={statusStyles[page.status]?.label || page.status}
        size="small"
        variant="filled"
        sx={{
          mb: 2,
          fontWeight: 500,
          color: 'unset', // Ensures your custom color is used
          ...statusStyles[page.status]?.sx,
        }}
      />

      <Paper
        elevation={2}
        sx={{
          padding: 3,
          border: '1px solid #e0e0e0',
          backgroundColor: '#fff',
          mt: 2,
        }}
      >
        <Box
          sx={{
            '& img': {
              maxWidth: '100%',
              borderRadius: '8px',
            },
            '& table': {
              borderCollapse: 'collapse',
              width: '100%',
              marginTop: 2,
            },
            '& th, & td': {
              border: '1px solid #ccc',
              padding: '8px',
              textAlign: 'left',
            },
            '& th': {
              backgroundColor: '#f5f5f5',
            },
          }}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </Paper>
    </Box>
  );
}
