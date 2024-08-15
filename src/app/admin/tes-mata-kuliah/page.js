'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { formatDateTimeHumanReadable } from '../../../../utils/dateFormat';
import DosenSidebar from '../../../../components/dosen/sidebar';
import Link from 'next/link';

export default function TesMataKuliah() {
  const router = useRouter();

  const [testData, setTestData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedIds, setSelectedIds] = useState(new Set()); // State for selected row IDs
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isWarning, setIsWarning] = useState(false); // State for warning message

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

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) => {
      const updatedSelectedIds = new Set(prevSelectedIds);
      if (updatedSelectedIds.has(id)) {
        updatedSelectedIds.delete(id);
      } else {
        updatedSelectedIds.add(id);
      }
      return updatedSelectedIds;
    });
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

  const handleDelete = () => {
    if (selectedIds.size === 0) {
      setIsWarning(true); // Show warning message if no rows selected
    } else {
      setIsModalOpen(true); // Show the confirmation modal if rows are selected
    }
  };

  const confirmDelete = () => {
    console.log('Selected IDs:', Array.from(selectedIds));
    // Implement delete functionality here, e.g., send a delete request to the server
    setIsModalOpen(false); // Hide the modal after deletion
    setSelectedIds(new Set()); // Clear selected IDs after deletion
  };

  const cancelDelete = () => {
    setIsModalOpen(false); // Hide the modal if canceled
    setIsWarning(false); // Hide the warning message if canceled
  };

  const handleWarningClose = () => {
    setIsWarning(false); // Close the warning message
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DosenSidebar/>
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-700">Universitas Siliwangi</h1>
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Fakultas Ekonomi</h2>
        <h3 className="text-xl font-medium mb-4 text-center text-gray-700">Jurusan Ekonomi Syariah</h3>
        <div className="mb-4 flex justify-end space-x-2">
          <Link
            href={{
              pathname: "/admin/tes-mata-kuliah/create"
            }}
          >
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Buat Tes Baru</button>
          </Link>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleDelete}>Non-Aktif</button>
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
                <th className="py-2 px-4 border-r">
                  Status
                  <button className="ml-1 text-xs" onClick={() => handleSort('published')}>
                    {sortConfig.key === 'published' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
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
                    <input
                      type="checkbox"
                      className="mx-2"
                      checked={selectedIds.has(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </td>
                  <td className="py-2 px-4 border-r">{item.id}</td>
                  <td className="py-2 px-4 border-r">{item.name}</td>
                  <td className="py-2 px-4 border-r">{item.matkul_name}</td>
                  <td className="py-2 px-4 border-r">{formatDateTimeHumanReadable(new Date(item.created_at))}</td>
                  <td className="py-2 px-4 border-r">{formatDateTimeHumanReadable(new Date(item.due_date))}</td>
                  <td className="py-2 px-4 border-r">{item.need_test_tpa ? 'Ya' : 'Tidak'}</td>
                  <td className="py-2 px-4 border-r">{item.published == 1 ? 'Aktif' : 'Tidak Aktif'}</td>
                  <td className="py-2 px-4 flex">
                    <Link
                      href={{
                        pathname: "/admin/tes-mata-kuliah/detail",
                        query: item
                      }}
                    >
                      <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Lihat</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Warning Modal */}
        {isWarning && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-black">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Peringatan</h2>
              <p className="mb-4">Anda harus memilih setidaknya satu baris sebelum menon-aktifkan Tes.</p>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={handleWarningClose}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {isModalOpen && !isWarning && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-black">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Konfirmasi Penon-aktifan Tes</h2>
              <p className="mb-4">Apakah Anda yakin ingin menon-aktifkan baris yang dipilih?</p>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={confirmDelete}
                >
                  Non-Aktif
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={cancelDelete}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
