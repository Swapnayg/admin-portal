'use client';

import * as React from 'react';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import AppNavbar from '@/components/AppNavbar';
import Header from '@/components/Header';
import SideMenu from '@/components/SideMenu';
import AppTheme from '@/theme/AppTheme';

import CreateEditCustomer from '@/components/CreateEditCustomer';

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '@/theme/customizations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

interface EditCustomerPageProps {
  params: { id: string };
}


interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
}

export default function EditCustomerPage({ params }: EditCustomerPageProps) {
  const id = Number(params.id);

  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetch(`/api/customers/get-customer?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data.customer);
      })
      .catch((err) => console.error('Error loading customer', err));
  }, [id]);

  return (
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            {customer && (
              <CreateEditCustomer
                initialData={{
                  id: customer.id,
                  name: customer.name,
                  email: customer.email,
                  phone: customer.phone ?? '',
                  address: (customer as any).address ?? '',
                  status: customer.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
                }}
                onSubmitSuccess={() => window.location.href = '/customers'}
              />
            )}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
