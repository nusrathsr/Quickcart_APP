'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

const ProfilePage = () => {
  const { user, setUser } = useAppContext();
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        address: user.address || '',
        phone: user.phone || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('http://localhost:3001/api/users/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update profile');
      }

      const data = await res.json();
      setUser(data.user); // Update user in context
      alert('Profile updated successfully');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <p className="text-center mt-10 text-gray-600">Please login to access your profile.</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4 font-semibold">Update Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            readOnly
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block mb-1">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className={`px-4 py-2 rounded text-white ${
            saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
