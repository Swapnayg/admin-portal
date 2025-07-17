// app/vendors/[id]/review/page.tsx

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  id: number;
}

export default async function ViewVendorPage({ id }: Props) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: id },
    include: {
      user: { select: { username: true, email: true } },
      category: true,
      zone: true,
      kycDocuments: true,
    },
  });

  if (!vendor) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded shadow-lg w-full">
      <div className="flex justify-between items-center w-full mb-6">
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
              vendor.kycDocuments.map((doc) => (
                <div key={doc.id} className="border p-2 rounded shadow-sm bg-gray-50">
                  <div className="font-semibold mb-1 text-gray-700">{doc.type}</div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-40 overflow-hidden rounded border border-gray-300"
                  >
                    <img
                      src={doc.fileUrl}
                      alt={doc.type}
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
         {/* Suspend button for approved status */}
        {vendor.status === "APPROVED" && (
          <form action="/api/vendors/suspend-vendor" method="POST">
            <input type="hidden" name="id" value={id} />
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white">
              Suspend Vendor
            </Button>
          </form>
        )}
      
        {/* Reactivate button for suspended status */}
      {vendor.status === "SUSPENDED" && (
        <form action="/api/vendors/reactivate-vendor" method="POST">
          <input type="hidden" name="id" value={id} />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Reactivate Account
          </Button>
        </form>
      )}

      </div>
    </div>
  );
}
