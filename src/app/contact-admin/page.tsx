'use client';

import { useState } from 'react';
import Image from 'next/image';
import contactImage from '@/public/contact-admin.png'; // Save uploaded image as `public/contact-admin.png`

const ticketTypes = [
  { label: 'General', value: 'GENERAL' },
  { label: 'Documents', value: 'DOCUMENTS' },
  { label: 'Technical Issue', value: 'TECHNICAL_ISSUE' },
  { label: 'Account Clearance', value: 'ACCOUNT_CLEARANCE' },
  { label: 'Reactivate Account', value: 'REACTIVATE_ACCOUNT' },
  { label: 'Support', value: 'SUPPORT' },
];

export default function ContactAdminForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'GENERAL',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          type: 'GENERAL',
        });
        setSuccess(true);
      } else {
        const err = await res.json();
        alert(err?.error || 'Submission failed');
      }
    } catch {
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left image */}
        <div className="relative bg-slate-800">
          <Image
            src={contactImage}
            alt="Contact Admin"
            layout="fill"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute bottom-6 left-6 text-white text-lg font-semibold z-10">
            Need help? <br /> Reach out to our support team
          </div>
        </div>

        {/* Right form */}
        <div className="p-8 bg-white text-slate-800">
          <h2 className="text-2xl font-bold mb-2">Contact Admin</h2>
          <p className="mb-6 text-slate-500">Submit a support ticket and we'll respond shortly.</p>

          {success && (
            <div className="mb-4 p-3 rounded text-green-700 bg-green-100 border border-green-300">
              Ticket submitted successfully. We'll contact you soon!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Your Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Ticket Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {ticketTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Subject</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Message</label>
              <textarea
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition duration-150"
            >
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
