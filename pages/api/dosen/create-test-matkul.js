'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Page() {
  const router = useRouter();

  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: '',
    matkul_name: '',
    created_at: '',
    due_date: '',
    need_test_tpa: false,
    description: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Make API call to create new test
    axios
      .post('/api/dosen/create-test', formData)
      .then((response) => {
        console.log('Test created successfully:', response.data);
        // Redirect or give feedback to the user
        router.push('/admin/tes-mata-kuliah');
      })
      .catch((error) => {
        console.error('Error creating test:', error);
      });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create New Test</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Nama Ujian
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="matkul_name">
            Mata Kuliah
          </label>
          <input
            type="text"
            name="matkul_name"
            id="matkul_name"
            value={formData.matkul_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="created_at">
            Tanggal Pembuatan
          </label>
          <input
            type="date"
            name="created_at"
            id="created_at"
            value={formData.created_at}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="due_date">
            Tanggal Pengerjaan
          </label>
          <input
            type="date"
            name="due_date"
            id="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
            Deskripsi
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows="4"
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="need_test_tpa"
            id="need_test_tpa"
            checked={formData.need_test_tpa}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
          <label className="text-gray-700 font-medium" htmlFor="need_test_tpa">
            Tes Potensi Akademik
          </label>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
