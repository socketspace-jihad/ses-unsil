'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { formatDateTimeHumanReadable } from '../../../../utils/dateFormat';
import DosenSidebar from '../../../../components/dosen/sidebar';

export default function TesMataKuliah() {
  const router = useRouter();

  const [testData, setTestData] = useState([]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...testData].sort((a, b) => {
      if (key === 'id') {
        return direction === 'ascending' ? a.id - b.id : b.id - a.id;
      } else {
        return direction === 'ascending' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
      }
    });

    setTestData(sortedData);
  };

  function toggleSubMenu(id) {
    const submenu = document.getElementById(`submenu-${id}`);
    if (submenu.classList.contains('hidden')) {
      submenu.classList.remove('hidden');
    } else {
      submenu.classList.add('hidden');
    }
  }

  useEffect(() => {
    axios
      .get('/api/dosen/test-matkul')
      .then((resp) => {
        setTestData(resp.data.rows);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <DosenSidebar/>
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-700">Universitas Siliwangi</h1>
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Fakultas Ekonomi</h2>
        <h3 className="text-xl font-medium mb-4 text-center text-gray-700">Jurusan Ekonomi Syariah</h3>
        <div className="mb-4 flex justify-end space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Buat Tes Baru</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Hapus</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-black">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 border-r">
                  <input type="checkbox" className="mx-2" />
                </th>
                <th className="py-2 px-4 border-r">
                  ID
                  <button className="ml-1 text-xs" onClick={() => handleSort('id')}>
                    {sortConfig.key === 'id' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Nama Ujian
                  <button className="ml-1 text-xs" onClick={() => handleSort('name')}>
                    {sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Mata Kuliah
                  <button className="ml-1 text-xs" onClick={() => handleSort('matkul_name')}>
                    {sortConfig.key === 'matkul_name' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Tanggal Pembuatan
                  <button className="ml-1 text-xs" onClick={() => handleSort('created_at')}>
                    {sortConfig.key === 'created_at' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Tanggal Pengerjaan
                  <button className="ml-1 text-xs" onClick={() => handleSort('due_date')}>
                    {sortConfig.key === 'due_date' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Tes Potensi Akademik
                  <button className="ml-1 text-xs" onClick={() => handleSort('need_test_tpa')}>
                    {sortConfig.key === 'need_test_tpa' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {testData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 border-r">
                    <input type="checkbox" className="mx-2" />
                  </td>
                  <td className="py-2 px-4 border-r">{item.id}</td>
                  <td className="py-2 px-4 border-r">{item.name}</td>
                  <td className="py-2 px-4 border-r">{item.matkul_name}</td>
                  <td className="py-2 px-4 border-r">{formatDateTimeHumanReadable(new Date(item.created_at))}</td>
                  <td className="py-2 px-4 border-r">{formatDateTimeHumanReadable(new Date(item.due_date))}</td>
                  <td className="py-2 px-4 border-r">{item.need_test_tpa ? 'Ya' : 'Tidak'}</td>
                  <td className="py-2 px-4 flex">
                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Lihat</button>
                    <button type="button" className="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );

  function handleCreate() {
    // Implement create functionality here
    console.log('Create button clicked');
  }

  function handleDelete() {
    // Implement delete functionality here
    console.log('Delete button clicked');
  }

  function handleUpdate() {
    // Implement update functionality here
    console.log('Update button clicked');
  }
}
