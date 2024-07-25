'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TesMataKuliah() {
  const router = useRouter();
  const [data, setData] = useState([
    { id: 1, namaUjian: 'Ujian Akhir Semester', mataKuliah: 'Ekonomi Mikro', tanggalPembuatan: '2024-01-10', tanggalPengerjaan: '2024-02-15', status: 'Selesai', tpa: 'Ya' },
    { id: 2, namaUjian: 'Ujian Tengah Semester', mataKuliah: 'Ekonomi Makro', tanggalPembuatan: '2024-03-05', tanggalPengerjaan: '2024-04-10', status: 'Sedang Berlangsung', tpa: 'Ya' },
    { id: 3, namaUjian: 'Quiz 1', mataKuliah: 'Ekonomi Islam', tanggalPembuatan: '2024-01-15', tanggalPengerjaan: '2024-01-20', status: 'Selesai', tpa: 'Ya' },
    { id: 4, namaUjian: 'Quiz 2', mataKuliah: 'Ekonomi Syariah', tanggalPembuatan: '2024-02-01', tanggalPengerjaan: '2024-02-05', status: 'Selesai', tpa: 'Ya' },
    { id: 5, namaUjian: 'Ujian Akhir Tahun', mataKuliah: 'Perbankan Syariah', tanggalPembuatan: '2024-06-20', tanggalPengerjaan: '2024-07-10', status: 'Sedang Berlangsung', tpa: 'Ya' },
  ]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (key === 'id') {
        return direction === 'ascending' ? a.id - b.id : b.id - a.id;
      } else {
        return direction === 'ascending' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
      }
    });

    setData(sortedData);
  };

  function toggleSubMenu(id) {
    const submenu = document.getElementById(`submenu-${id}`);
    if (submenu.classList.contains('hidden')) {
      submenu.classList.remove('hidden');
    } else {
      submenu.classList.add('hidden');
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4 text-lg font-bold">Smart Exam System</div>
        <nav className="mt-4">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-700">
              <button className="w-full text-left focus:outline-none" onClick={() => toggleSubMenu('tes')}>
                Tes
              </button>
              <ul id="submenu-tes" className="hidden mt-2 pl-4">
                <li className="px-4 py-2 hover:bg-gray-700">
                  <a href="/admin/tes-mata-kuliah">Tes Mata Kuliah</a>
                </li>
                <li className="px-4 py-2 hover:bg-gray-700">
                  <a href="/admin/tes-potensi-akademik">Tes Potensi Akademik</a>
                </li>
              </ul>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="/profile">Profile</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <button onClick={() => { router.push('/login'); }} className="w-full text-left">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
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
                  <button className="ml-1 text-xs" onClick={() => handleSort('namaUjian')}>
                    {sortConfig.key === 'namaUjian' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Mata Kuliah
                  <button className="ml-1 text-xs" onClick={() => handleSort('mataKuliah')}>
                    {sortConfig.key === 'mataKuliah' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Tanggal Pembuatan
                  <button className="ml-1 text-xs" onClick={() => handleSort('tanggalPembuatan')}>
                    {sortConfig.key === 'tanggalPembuatan' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Tanggal Pengerjaan
                  <button className="ml-1 text-xs" onClick={() => handleSort('tanggalPengerjaan')}>
                    {sortConfig.key === 'tanggalPengerjaan' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Status
                  <button className="ml-1 text-xs" onClick={() => handleSort('status')}>
                    {sortConfig.key === 'status' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Tes Potensi Akademik
                  <button className="ml-1 text-xs" onClick={() => handleSort('tpa')}>
                    {sortConfig.key === 'tpa' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 border-r">
                    <input type="checkbox" className="mx-2" />
                  </td>
                  <td className="py-2 px-4 border-r">{item.id}</td>
                  <td className="py-2 px-4 border-r">{item.namaUjian}</td>
                  <td className="py-2 px-4 border-r">{item.mataKuliah}</td>
                  <td className="py-2 px-4 border-r">{item.tanggalPembuatan}</td>
                  <td className="py-2 px-4 border-r">{item.tanggalPengerjaan}</td>
                  <td className="py-2 px-4 border-r">{item.status}</td>
                  <td className="py-2 px-4 border-r">{item.tpa}</td>
                  <td className="py-2 px-4 flex">
                    <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Lihat</button>
                    <button type="button" class="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Edit</button>  
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
