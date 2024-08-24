'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import DosenSidebar from '../../../../../components/dosen/sidebar';

export default function CreateMahasiswa() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    npm: '',
    contact: '',
    angkatan: '',
    disability_status: false, // Tambahkan state untuk disabilitas tunanetra
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Tambahkan state untuk status pengiriman

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set status pengiriman sebelum melakukan request
    try {
      await axios.post('/api/dosen/create-mahasiswa', formData);
      router.push('/admin/mahasiswa'); // Redirect to the mahasiswa list page
    } catch (error) {
      console.error('Failed to create mahasiswa:', error);
    } finally {
      setIsSubmitting(false); // Reset status pengiriman setelah request selesai
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DosenSidebar />
      <main className="flex-1 p-6 text-black">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-700">Tambah Data Mahasiswa</h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="npm" className="block text-sm font-medium text-gray-700">NPM</label>
            <input
              type="text"
              id="npm"
              name="npm"
              value={formData.npm}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Kontak</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="angkatan" className="block text-sm font-medium text-gray-700">Angkatan</label>
            <input
              type="number"
              id="angkatan"
              name="angkatan"
              value={formData.angkatan}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="tunanetra"
              name="tunanetra"
              value={formData.disability_status}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="tunanetra" className="text-sm font-medium text-gray-700">Disabilitas Tunanetra</label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500'} text-white hover:${isSubmitting ? '' : 'bg-blue-600'}`}
            >
              {isSubmitting ? 'Memproses...' : 'Tambah'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
