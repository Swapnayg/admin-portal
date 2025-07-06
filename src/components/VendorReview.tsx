
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ReviewVendorPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const res = await fetch(`/api/vendors?id=${id}`);
  const data = await res.json();
  const vendor = data.vendor;
  if (!vendor) return notFound();

  return (
   <div>hi</div>
  );
}
