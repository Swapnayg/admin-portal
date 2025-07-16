import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendApprovalEmail } from '@/lib/vendor-mails';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service key for admin actions
);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const id = formData.get('id');

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid vendor ID' }, { status: 400 });
    }

    // Update vendor status
    const vendor = await prisma.vendor.update({
      where: { id: parseInt(id.toString()) },
      data: { status: 'APPROVED' },
      include: { user: true },
    });

    const username = vendor.user?.username || vendor.user?.email;
    const email = vendor.user?.email;
    const password = vendor.user?.tempPassword;

    if (email && username && password) {
      // Check if user already exists in Supabase
      const { data: existingUsers, error: fetchError } = await supabaseAdmin.auth.admin.listUsers({
        email
      });

      const userExists = existingUsers?.users?.some(u => u.email === email);

      if (!userExists) {
        // Create user in Supabase
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            displayName: username,
            role: 'vendor',
          },
        });

        if (error) {
          console.error('Supabase createUser error:', error);
          throw error;
        }
      }

      // Send email
      await sendApprovalEmail(email, username, password);
    }

    return NextResponse.redirect(new URL('/vendors', req.url));
  } catch (error) {
    console.error('Approve Vendor Error:', error);
    return NextResponse.json({ error: 'Failed to approve vendor' }, { status: 500 });
  }
}
