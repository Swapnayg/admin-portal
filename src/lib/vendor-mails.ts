// lib/mail.ts
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your provider
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendApprovalEmail = async (to: string, username: string, password: string) => {
  const panelUrl = process.env.NEXT_PUBLIC_BASE_URL + '/login';
  const androidAppLink = process.env.NEXT_PUBLIC_ANDROID_APP_LINK;
  const logoUrl = process.env.NEXT_PUBLIC_BASE_URL + '/favicon.ico';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9fafb; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <div style="padding: 30px; text-align: center; background-color: #1e293b; color: white;">
          <img src="${logoUrl}" alt="Company Logo" style="width: 60px; margin-bottom: 10px;" />
          <h1 style="margin: 0; font-size: 24px;">Vendor Registration Approved 🎉</h1>
        </div>

        <div style="padding: 30px;">
          <p style="font-size: 16px;">Dear Vendor,</p>
          <p style="font-size: 16px;">We are excited to inform you that your vendor application has been <strong style="color: #22c55e;">approved</strong>!</p>

          <div style="margin: 20px 0; background-color: #f3f4f6; padding: 15px; border-radius: 6px;">
            <p style="margin: 0; font-size: 15px;"><strong>Username:</strong> ${username}</p>
            <p style="margin: 0; font-size: 15px;"><strong>Password:</strong> ${password}</p>
          </div>

          <p style="font-size: 15px;">You can now log in to your vendor dashboard and start managing your products and services.</p>

          <div style="margin: 25px 0;">
            <a href="${panelUrl}" style="display: inline-block; padding: 12px 24px; background-color: #1e293b; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Login Panel</a>
          </div>

          <p style="font-size: 15px;">Or download our Android app for an easier experience:</p>
          <a href="${androidAppLink}" style="display: inline-block; margin-top: 10px; text-decoration: none; color: #1d4ed8;">Download Android App</a>

          <hr style="margin: 30px 0;" />

          <p style="font-size: 14px; color: #6b7280;">If you have any questions, feel free to reach out to our support team.</p>
          <p style="font-size: 14px; color: #6b7280;">Thank you for choosing our platform!</p>

          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">— Vendor Support Team</p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Vendor Portal" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Your Vendor Account Has Been Approved!',
    html: htmlContent,
  });
};



export const sendRejectionEmail = async (to: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const logoUrl = `${baseUrl}/favicon.ico`;
  const contactUrl = `${baseUrl}/contact-admin`; // Optional: contact admin link

  const htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9fafb; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <div style="padding: 30px; text-align: center; background-color: #1e293b; color: white;">
          <img src="${logoUrl}" alt="Company Logo" style="width: 60px; margin-bottom: 10px;" />
          <h1 style="margin: 0; font-size: 24px;">Application Rejected</h1>
        </div>

        <div style="padding: 30px;">
          <p style="font-size: 16px;">Dear Applicant,</p>
          <p style="font-size: 16px;">We appreciate your interest in joining our platform as a vendor. After careful review, we regret to inform you that your application has not been approved at this time.</p>

          <p style="font-size: 15px;">This decision may be due to incomplete or inconsistent information, or misalignment with our current requirements.</p>

          <p style="font-size: 15px;">If you believe this was a mistake or you need clarification, feel free to contact our support team.</p>

          <div style="margin: 25px 0;">
            <a href="${contactUrl}" style="display: inline-block; padding: 12px 24px; background-color: #1e293b; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Contact Admin</a>
          </div>

          <hr style="margin: 30px 0;" />

          <p style="font-size: 14px; color: #6b7280;">Thank you once again for your application. We encourage you to reapply in the future.</p>

          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">— Vendor Approval Team</p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Vendor Portal" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Your Vendor Application Has Been Rejected',
    html: htmlContent,
  });
};


export const sendSuspensionEmail = async (to: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const logoUrl = `${baseUrl}/favicon.ico`;
  const contactAdminUrl = `${baseUrl}/contact-admin`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9fafb; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <div style="padding: 30px; text-align: center; background-color: #1e293b; color: white;">
          <img src="${logoUrl}" alt="Company Logo" style="width: 60px; margin-bottom: 10px;" />
          <h1 style="margin: 0; font-size: 24px;">Account Suspended</h1>
        </div>

        <div style="padding: 30px;">
          <p style="font-size: 16px;">Dear Vendor,</p>
          <p style="font-size: 16px;">We regret to inform you that your vendor account has been <strong style="color: #b45309;">suspended</strong> due to policy violations or unresolved account issues.</p>

          <p style="font-size: 15px;">This suspension may limit your access to the platform until the matter is resolved.</p>
          <p style="font-size: 15px;">If you believe this was a mistake or wish to appeal the suspension, you can contact our support team for clarification or resolution.</p>

          <div style="margin: 25px 0; text-align: center;">
            <a href="${contactAdminUrl}" style="
              background-color: #1e293b;
              color: #fff;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              display: inline-block;
            ">Contact Admin</a>
          </div>

          <hr style="margin: 30px 0;" />

          <p style="font-size: 14px; color: #6b7280;">We are here to help and hope to resolve this as soon as possible.</p>
          <p style="font-size: 14px; color: #6b7280;">Thank you for your understanding.</p>

          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">— Vendor Support Team</p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Vendor Portal" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your Vendor Account Has Been Suspended",
    html: htmlContent,
  });
};




export const sendReactivationEmail = async (
  to: string,
  username: string,
  password: string
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const loginUrl = `${baseUrl}/login`;
  const logoUrl = `${baseUrl}/favicon.ico`;
  const androidAppLink = process.env.NEXT_PUBLIC_ANDROID_APP_LINK;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9fafb; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <div style="padding: 30px; text-align: center; background-color: #1e293b; color: white;">
          <img src="${logoUrl}" alt="Company Logo" style="width: 60px; margin-bottom: 10px;" />
          <h1 style="margin: 0; font-size: 24px;">Vendor Account Reactivated</h1>
        </div>

        <div style="padding: 30px;">
          <p style="font-size: 16px;">Dear Vendor,</p>
          <p style="font-size: 16px;">We're happy to inform you that your vendor account has been <strong style="color: #10b981;">successfully reactivated</strong>.</p>

          <div style="margin: 20px 0; background-color: #f3f4f6; padding: 15px; border-radius: 6px;">
            <p style="margin: 0; font-size: 15px;"><strong>Username:</strong> ${username}</p>
            <p style="margin: 0; font-size: 15px;"><strong>Password:</strong> ${password}</p>
          </div>

          <p style="font-size: 15px;">You can now log in to your vendor dashboard to manage your profile, products, and orders.</p>

          <div style="margin: 25px 0; text-align: center;">
            <a href="${loginUrl}" style="
              background-color: #1e293b;
              color: #fff;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              display: inline-block;
            ">Go to Login Panel</a>
          </div>

          <p style="font-size: 15px; text-align: center;">or use our mobile app:</p>

          <div style="text-align: center;">
            <a href="${androidAppLink}" style="color: #1d4ed8; font-weight: 500;">
              Download Android App
            </a>
          </div>

          <hr style="margin: 30px 0;" />

          <p style="font-size: 14px; color: #6b7280;">If you have any questions or need help accessing your account, feel free to contact our support team.</p>

          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">— Vendor Support Team</p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Vendor Portal" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your Vendor Account Has Been Reactivated",
    html: htmlContent,
  });
};


export const sendAcknowledgementEmail = async ({
  to,
  name,
  subject,
}: {
  to: string;
  name?: string;
  subject: string;
}) => {
  const mailOptions = {
    from: `"Support Team" <${process.env.GMAIL_USER}>`,
    to,
    subject: `We've received your ticket: ${subject}`,
    html: `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #4f46e5;">Hi ${name || 'there'},</h2>
        <p>Thank you for reaching out to us. We’ve received your support request and our team is already on it.</p>
        <p>We believe that with a little patience and support, every issue finds a solution.</p>

        <blockquote style="margin: 1em 0; padding: 1em; background: #f0f4ff; border-left: 4px solid #4f46e5;">
          “Hope is being able to see that there is light despite all of the darkness.” – Desmond Tutu
        </blockquote>

        <p>We’ll get back to you as soon as possible. Meanwhile, feel free to reply if you have additional info.</p>

        <p style="margin-top: 2em;">Warm regards,<br/>The Support Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);

};



interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendTicketEmail({ to, subject, html }: SendEmailOptions) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}
