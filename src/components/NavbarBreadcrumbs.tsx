'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import { usePathname } from 'next/navigation';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function BreadcrumbNav() {
  const pathname = usePathname(); // e.g. "/dashboard/analytics"
  const segments = pathname.split('/').filter(Boolean); // remove empty strings

  const currentPage = segments.length > 0
    ? segments[segments.length - 1].replace(/-/g, ' ')
    : 'Dashboard';

  const formattedPage = currentPage
    .charAt(0).toUpperCase() + currentPage.slice(1);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Dashboard</Typography>
      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
        {formattedPage}
      </Typography>
    </StyledBreadcrumbs>
  );
}
