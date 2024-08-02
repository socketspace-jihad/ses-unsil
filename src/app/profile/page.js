"use client"

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Mendaftar elemen yang diperlukan
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

const Profile = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Data nilai ujian TPA
  const tpaData = {
    labels: ['01/07/2024', '15/07/2024', '30/07/2024', '14/08/2024', '28/08/2024'],
    datasets: [
      {
        label: 'Nilai TPA',
        data: [78, 85, 90, 88, 92],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data nilai ujian Matkul
  const matkulData = {
    labels: ['01/07/2024', '15/07/2024', '30/07/2024', '14/08/2024', '28/08/2024'],
    datasets: [
      {
        label: 'Nilai Matkul',
        data: [82, 89, 91, 87, 94],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Contoh data presensi
  const presensi = [
    { tanggal: '01/07/2024', hadir: true },
    { tanggal: '02/07/2024', hadir: true },
    { tanggal: '03/07/2024', hadir: false },
    { tanggal: '04/07/2024', hadir: true },
    { tanggal: '05/07/2024', hadir: true },
    { tanggal: '08/07/2024', hadir: true },
    { tanggal: '09/07/2024', hadir: false },
    { tanggal: '10/07/2024', hadir: true },
    { tanggal: '11/07/2024', hadir: true },
    { tanggal: '12/07/2024', hadir: true },
  ];

  // Alamat tempat tinggal
  const address = 'Jl. Contoh Alamat No. 123, Kota Contoh, Negara Contoh';

  const handleLogout = () => {
    setCookie(null, "auth-token", null, { path: "/" });
    router.push("/auth/login");
  };

  return (
    <div className="flex bg-gray-100 h-screen text-black">
       <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4 text-lg font-bold">Smart Exam System</div>
        <nav className="mt-4">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="/dashboard">Dashboard</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="/profile">Profile</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <button onClick={handleLogout} className="w-full text-left">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <div id="content" className={`flex-1 transition-all duration-300 max-w-screen overflow-auto`}>
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="flex items-center p-6">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500"
            />
            <div className="ml-6">
              <h1 className="text-3xl font-semibold text-gray-800">Salman Halim Alfatih</h1>
              <p className="text-gray-600">Tempat, Tanggal Lahir: Kota, 07 Februari 2019</p>
              <p className="text-gray-600">Hobi: Bermain, Olahraga</p>
              <p className="text-gray-600">Deskripsi Diri: Seorang siswa yang antusias dengan berbagai kegiatan akademik dan non-akademik.</p>
              <div className="mt-4 flex items-center">
                <p className="text-gray-600">{address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <FaMapMarkerAlt size={24} />
                </a>
              </div>
            </div>
            <div className="ml-6" id="socmed">
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col space-y-4">
            {/* Bar Chart: Histori Nilai TPA */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">Histori Nilai TPA</h2>
              <div className="mt-4 h-72">
                <Bar data={tpaData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Bar Chart: Histori Nilai Matkul */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">Histori Nilai Matkul</h2>
              <div className="mt-4 h-72">
                <Bar data={matkulData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
