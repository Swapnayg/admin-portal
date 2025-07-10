'use client';

import { useState } from 'react';
import Image from 'next/image';


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
      const res = await fetch('/api/tickets/add-contact', {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-12">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left: Clear image with soft overlay */}
        <div className="relative h-full min-h-[500px] bg-slate-100">
          <Image
            src='/contact-support.png'
            alt="Contact Admin"
            fill
            className="object-cover"
            priority
          />
          {/* Optional soft gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-slate-900/30" />

          {/* Message over the image */}
          <div className="absolute bottom-8 left-8 z-20 px-4 py-3 bg-black/60 rounded-lg backdrop-blur-sm shadow-md text-white max-w-xs">
            <h3 className="text-2xl font-bold leading-tight drop-shadow-md">Need Help?</h3>
            <p className="text-sm text-white/90 mt-1 drop-shadow-md">
              Reach out to our Support Team
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="p-10 bg-white text-slate-800">
          <h2 className="text-3xl font-semibold mb-2">Contact Admin</h2>
          <p className="mb-6 text-slate-500">
            Submit a support ticket and we’ll respond shortly.
          </p>

          {success && (
            <div className="mb-4 p-3 rounded text-green-700 bg-green-100 border border-green-300">
              Ticket submitted successfully. We’ll contact you soon!
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
                className="w-full px-4 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-4 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Ticket Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-4 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-4 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition duration-150"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
