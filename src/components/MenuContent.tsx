'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import {
  Dashboard,
  Store,
  Inventory2,
  ShoppingCart,
  Payments,
  AccountBalanceWallet,
  Analytics,
  PeopleAlt,
  SupportAgent,
  LocalOffer,
  Article,
  Settings,
} from '@mui/icons-material';

const mainListItems  = [
  { text: 'Dashboard', icon: <Dashboard />, href: '/' },
  { text: 'Vendors', icon: <Store />, href: '/vendors' },
  { text: 'Products', icon: <Inventory2 />, href: '/products' },
  { text: 'Orders', icon: <ShoppingCart />, href: '/orders' },
  { text: 'Payments', icon: <Payments />, href: '/payments' },
  { text: 'Payouts', icon: <AccountBalanceWallet />, href: '/payouts' },
  { text: 'Reports & Analytics', icon: <Analytics />, href: '/analytics' },
  { text: 'Customers', icon: <PeopleAlt />, href: '/customers' },
  { text: 'Tickets / Support', icon: <SupportAgent />, href: '/support' },
  { text: 'Promotions', icon: <LocalOffer />, href: '/promotions' },
  { text: 'CMS / Content', icon: <Article />, href: '/cms' },
  { text: 'Settings', icon: <SettingsRoundedIcon />, href: '/settings' },
];

export default function MenuContent() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ display: 'block', mb: 1 }} // Add margin-bottom here
          >
            <ListItemButton
              selected={pathname === item.href}
              onClick={() => handleNavigate(item.href)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* <List dense>
        {secondaryListItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={pathname === item.href}
              onClick={() => handleNavigate(item.href)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
}
