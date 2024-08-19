'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DosenSidebar from '../../../../components/dosen/sidebar';
import axios from 'axios';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();

  const [mahasiswa, setMahasiswa] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const itemsPerPage = 50;

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const fetchMahasiswa = () => {
    axios.get("/api/dosen/mahasiswa")
      .then(resp => {
        setMahasiswa(resp.data.rows);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...mahasiswa].sort((a, b) => {
      const aValue = a[key] ? a[key].toString() : '';
      const bValue = b[key] ? b[key].toString() : '';

      if (direction === 'ascending') {
        return aValue.localeCompare(bValue, undefined, { numeric: true });
      } else {
        return bValue.localeCompare(aValue, undefined, { numeric: true });
      }
    });

    setMahasiswa(sortedData);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  const handleDelete = () => {
    axios.put("/api/dosen/deactivate-mahasiswa", { ids: selectedIds })
      .then(resp => {
        console.log(resp);
        fetchMahasiswa(); // Refresh the data
        setSelectedIds([]); // Deselect all checkboxes
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleActivate = () => {
    axios.put("/api/dosen/activate-mahasiswa", { ids: selectedIds })
      .then(resp => {
        console.log(resp);
        fetchMahasiswa(); // Refresh the data
        setSelectedIds([]); // Deselect all checkboxes
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleResetPass = (id,npm,email) => {
    axios.put("/api/dosen/mahasiswa/reset-pass",{id,npm,email})
    .then(resp=>{
        console.log("RESP",resp)
    })
    .catch(err=>{
        console.log(err)
    })
  };

  const filteredMahasiswa = mahasiswa.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.npm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.angkatan.toString().includes(searchQuery)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMahasiswa = filteredMahasiswa.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredMahasiswa.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DosenSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-700">Universitas Siliwangi</h1>
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Fakultas Ekonomi</h2>
        <h3 className="text-xl font-medium mb-4 text-center text-gray-700">Jurusan Ekonomi Syariah</h3>

        <div className="mb-4 flex justify-between items-center text-black">
          <input
            type="text"
            placeholder="Cari mahasiswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          />
          <div className="flex space-x-2">
            <Link
              href={{
                pathname: "/admin/mahasiswa/create"
              }}
            >
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Tambah Data Mahasiswa</button>
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Non-Aktifkan
            </button>
            <button
              onClick={handleActivate}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Aktifkan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-black">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 border-r">
                  <input type="checkbox" className="mx-2" />
                </th>
                <th className="py-2 px-4 border-r">
                  Nama
                  <button className="ml-1 text-xs" onClick={() => handleSort('name')}>
                    {sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Email
                  <button className="ml-1 text-xs" onClick={() => handleSort('email')}>
                    {sortConfig.key === 'email' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  NPM
                  <button className="ml-1 text-xs" onClick={() => handleSort('npm')}>
                    {sortConfig.key === 'npm' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Kontak
                  <button className="ml-1 text-xs" onClick={() => handleSort('contact')}>
                    {sortConfig.key === 'contact' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Angkatan
                  <button className="ml-1 text-xs" onClick={() => handleSort('angkatan')}>
                    {sortConfig.key === 'angkatan' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Status Akun
                  <button className="ml-1 text-xs" onClick={() => handleSort('active_status')}>
                    {sortConfig.key === 'active_status' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4 border-r">
                  Status Disabilitas
                  <button className="ml-1 text-xs" onClick={() => handleSort('disability_status')}>
                    {sortConfig.key === 'disability_status' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="py-2 px-4">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedMahasiswa.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 border-r">
                    <input
                      type="checkbox"
                      className="mx-2"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </td>
                  <td className="py-2 px-4 border-r">{item.name}</td>
                  <td className="py-2 px-4 border-r">{item.email}</td>
                  <td className="py-2 px-4 border-r">{item.npm}</td>
                  <td className="py-2 px-4 border-r">{item.contact}</td>
                  <td className="py-2 px-4 border-r">{item.angkatan}</td>
                  <td className="py-2 px-4 border-r">{item.active_status ? 'Aktif' : 'Non-Aktif'}</td>
                  <td className="py-2 px-4 border-r">{item.disability_status ? 'Ya' : 'Tidak'}</td>
                  <td className="py-2 px-4">
                    <Link
                      href={{
                        pathname: `/admin/mahasiswa/detail`,
                        query: item
                      }}
                    >
                      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Lihat</button>
                    </Link>
                    <button
                      onClick={() => handleResetPass(item.id,item.npm,item.email)}
                      className="px-4 ml-2 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                      Reset Pass
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Prev
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
