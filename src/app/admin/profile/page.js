"use client"

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js';
import { FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import DosenSidebar from '../../../../components/dosen/sidebar';

// Register chart elements
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

const Profile = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({});
  const [testTPA, setTestTPA] = useState([]);
  const [testMatkul, setTestMatkul] = useState([]);

  useEffect(() => {
    axios.get("/api/dosen/profile")
      .then(resp => {
        setProfile(resp.data.rows[0]);
      })
      .catch(err => {
        console.log(err);
      });

    axios.get("/api/dosen/get-nilai-matkul")
      .then(resp => {
        console.log("MATKUL",resp);
        setTestMatkul(resp.data.rows); // Adjust if data is nested
      })
      .catch(err => {
        console.log(err);
      });

    axios.get("/api/dosen/get-nilai-tpa")
      .then(resp => {
        console.log("TPA",resp);
        setTestTPA(resp.data.rows); // Adjust if data is nested
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  // Transform data function
  const transformData = (data) => {
    if (!Array.isArray(data)) {
      console.error("Data is not an array:", data);
      return {
        labels: [],
        datasets: [
          {
            label: 'Nilai',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels: data.map(item => item.name || new Date(item.name).toLocaleDateString('id-ID')), // Use exam names or fallback to formatted date
      datasets: [
        {
          label: 'Nilai',
          data: data.map(item => item.score),
          backgroundColor: 'rgba(54, 162, 235, 0.5)', // Customize as needed
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Show legend
        position: 'bottom', // Position the legend below the chart
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false, // Display all labels on the x-axis
        }
      }
    }
  };

  // Chart data
  const tpaData = transformData(testTPA);
  const matkulData = transformData(testMatkul);

  const handleLogout = () => {
    setCookie(null, "auth-token", null, { path: "/" });
    router.push("/auth/login");
  };

  return (
    <div className="flex bg-gray-100 h-screen text-black">
      <DosenSidebar/>
      <div id="content" className={`flex-1 transition-all duration-300 max-w-screen overflow-auto`}>
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="flex items-center p-6">
            <img
              src="/graduated.png"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500"
            />
            <div className="ml-6">
              <h1 className="text-3xl font-semibold text-gray-800">{profile.name}</h1>
              <p className="text-gray-600">NIDN: {profile.nidn}</p>
              <p className="text-gray-600">Kontak: {profile.contact ? profile.contact : "-"}</p>
            </div>
            <div className="ml-6" id="socmed">
              {/* Social media links */}
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col space-y-4">
            {/* Bar Chart: Histori Nilai TPA */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">Histori Nilai Rata Rata Mahasiswa Ujian TPA</h2>
              <div className="mt-4 h-72">
                <Bar data={tpaData} options={chartOptions} />
              </div>
            </div>

            {/* Bar Chart: Histori Nilai Matkul */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">Histori Nilai Rata Rata Mahasiswa Ujian Mata Kuliah</h2>
              <div className="mt-4 h-72">
                <Bar data={matkulData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
