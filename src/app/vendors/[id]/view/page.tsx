'use client';

import * as React from 'react';
import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Button } from "@/components/ui/button";

import AppNavbar from '@/components/AppNavbar';
import Header from '@/components/Header';
import SideMenu from '@/components/SideMenu';
import AppTheme from '@/theme/AppTheme';

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '@/theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function ViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [vendor, setVendor] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchVendor = async () => {
      try {
        const res = await fetch(`/api/vendors/get-vendor?id=${id}`);
        const data = await res.json();
        if (!data.vendor) {
          router.replace("/vendors");
          return;
        }
        setVendor(data.vendor);
      } catch (error) {
        console.error("Failed to fetch vendor", error);
        router.replace("/vendors");
      }
    };

    fetchVendor();
  }, [id, router]);

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
            {vendor && (
              <div className="w-full p-6 space-y-6 bg-white rounded shadow-lg">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-gray-800">Vendor Details</h1>
                  <Link
                    href="/vendors"
                    className="text-sm text-slate-600 hover:underline hover:text-slate-800"
                  >
                    ← Back to Vendors
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <strong className="text-gray-700">Business Name:</strong>
                    <div className="text-gray-900">{vendor.businessName}</div>
                  </div>
                  <div>
                    <strong className="text-gray-700">Status:</strong>
                    <div className="text-gray-900">{vendor.status}</div>
                  </div>
                  <div>
                    <strong className="text-gray-700">Username:</strong>
                    <div className="text-gray-900">{vendor.user.username}</div>
                  </div>
                  <div>
                    <strong className="text-gray-700">Email:</strong>
                    <div className="text-gray-900">{vendor.user.email}</div>
                  </div>
                  <div>
                    <strong className="text-gray-700">Phone:</strong>
                    <div className="text-gray-900">{vendor.phone}</div>
                  </div>
                  <div>
                    <strong className="text-gray-700">Address:</strong>
                    <div className="text-gray-900">
                      {vendor.address}, {vendor.city}, {vendor.state} - {vendor.zipcode}
                    </div>
                  </div>
                  <div>
                    <strong className="text-gray-700">Category:</strong>
                    <div className="text-gray-900">{vendor.category?.name || "—"}</div>
                  </div>
                  <div>
                    <strong className="text-gray-700">Zone:</strong>
                    <div className="text-gray-900">{vendor.zone?.name || "—"}</div>
                  </div>
                  <div>
                    <strong className="text-gray-700">GST Number:</strong>
                    <div className="text-gray-900">{vendor.gstNumber || "—"}</div>
                  </div>
                  <div className="md:col-span-2">
                    <strong className="text-gray-700">KYC Documents:</strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      {vendor.kycDocuments.length > 0 ? (
                        vendor.kycDocuments.map((doc: { id: React.Key | null | undefined; type: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; fileUrl: string | Blob | undefined; }) => (
                          <div key={doc.id} className="border p-2 rounded shadow-sm bg-gray-50">
                            <div className="font-semibold mb-1 text-gray-700">{doc.type}</div>
                            <a
                              href={typeof doc.fileUrl === 'string'? doc.fileUrl: doc.fileUrl? URL.createObjectURL(doc.fileUrl): undefined}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full h-40 overflow-hidden rounded border border-gray-300"
                            >
                         <img
                            src={doc.fileUrl ?? ''}
                            alt={typeof doc.type === 'string' ? doc.type : String(doc.type ?? '')}
                            className="object-contain w-full h-full hover:scale-105 transition-transform duration-200"
                        />
                      </a>
                    </div>
                        ))
                      ) : (
                        <div className="text-gray-500">No documents</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 justify-end">
                  {vendor.status === "APPROVED" && (
                    <form
                      action="/api/vendors/suspend-vendor"
                      method="POST"
                      onSubmit={() => setIsProcessing(true)}
                    >
                      <input type="hidden" name="id" value={id} />
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="bg-purple-500 hover:bg-purple-600 text-white cursor-pointer"
                      >
                        {isProcessing ? "Suspending..." : "Suspend Vendor"}
                      </Button>
                    </form>
                  )}

                  {vendor.status === "SUSPENDED" && (
                    <form
                      action="/api/vendors/reactivate-vendor"
                      method="POST"
                      onSubmit={() => setIsProcessing(true)}
                    >
                      <input type="hidden" name="id" value={id} />
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white cursor-pointer"
                      >
                        {isProcessing ? "Reactivating..." : "Reactivate Account"}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
