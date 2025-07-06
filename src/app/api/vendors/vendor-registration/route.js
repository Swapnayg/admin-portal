import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { notifyAdmins } from "@/lib/notifications";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

// --- EMAIL SETUP ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendVendorConfirmationEmail(to, name) {
  await transporter.sendMail({
    from: `"Vendor Portal" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Vendor Registration Received",
    html: `
      <p>Hi ${name},</p>
      <p>We have received your vendor registration. Our team will review and contact you shortly.</p>
      <p>Thanks,<br/>Admin Team</p>
    `,
  });
}

// --- MAIN HANDLER ---
export async function POST(req) {
  try {
    const data = await req.json();
    const {
      username,
      password,
      businessName,
      businessType,
      website,
      email,
      phoneNumber,
      businessAddress,
      city,
      state,
      zipcode,
      gstNumber,
      contactPersonName,
      contactPersonEmail,
      contactPersonPhone,
      designation,
      documents, // { panCardUrl, gstCertificateUrl, addressProofUrl }
    } = data;

    // Step 1: Check if user or vendor already exists
    const existingUserByEmail = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    const existingVendorByBusiness = await prisma.vendor.findFirst({
      where: { businessName },
    });

    if (existingUserByEmail || existingVendorByBusiness) {
      return NextResponse.json(
        { error: "A user or business with this email/name already exists." },
        { status: 400 }
      );
    }

    // Step 2: Create User
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: "VENDOR",
      },
    });

    const category = await prisma.vendorCategory.findFirst({
      where: { name: businessType },
    });

    // Step 3: Create Vendor
    const vendor = await prisma.vendor.create({
      data: {
        userId: user.id,
        businessName,
        gstNumber,
        phone: phoneNumber,
        address: businessAddress,
        city,
        state,
        zipcode,
        website,
        contactName: contactPersonName,
        contactEmail: contactPersonEmail,
        contactPhone: contactPersonPhone,
        designation,
        status: "PENDING",
        categoryId: category?.id ?? null,
      },
    });

    // Step 4: Save KYC documents
    const kycDocs = [];

    if (documents.panCardUrl) {
      kycDocs.push({
        vendorId: vendor.id,
        type: "panCard",
        fileUrl: documents.panCardUrl,
      });
    }
    if (documents.gstCertificateUrl) {
      kycDocs.push({
        vendorId: vendor.id,
        type: "gstCertificate",
        fileUrl: documents.gstCertificateUrl,
      });
    }
    if (documents.addressProofUrl) {
      kycDocs.push({
        vendorId: vendor.id,
        type: "addressProof",
        fileUrl: documents.addressProofUrl,
      });
    }

    if (kycDocs.length) {
      await prisma.kYC.createMany({ data: kycDocs });
    }

    // Step 5: Send email to vendor
    await sendVendorConfirmationEmail(email, contactPersonName);

    // Step 6: Notify admins
    await notifyAdmins(
      "New Vendor Registration",
      `${businessName} has submitted a vendor application for approval.`,
      "VENDOR_REGISTRATION"
    );

    return NextResponse.json({ message: "Vendor registered successfully" });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
