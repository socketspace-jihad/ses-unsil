"use client";


import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie, setCookie } from 'cookies-next';
import axios from 'axios';
import { formatDateTimeHumanReadable } from '../../../utils/dateFormat';
import Link from 'next/link';

export default function Dashboard({cookies}){
    const router = useRouter();
    const [testData,setTestData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(()=>{
      const token = getCookie("auth-token");
      if(!token){
        return router.push("/auth/login");
      }
      axios.get("/api/data")
      .then((data)=>{setTestData(data.data.rows)})
      .catch(err=>{
        if(err.response.status == 401){
          return router.push("/auth/login");
        }
      })
    },[])
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

    return (
      <div className="flex h-screen bg-gray-100">
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
                <button onClick={()=>{
                    setCookie("auth-token",null);
                    router.push("/auth/login")
                }} className="w-full text-left">
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
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg text-black">
              <thead>
                <tr className="bg-gray-100 border-b">
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
                    <button className="ml-1 text-xs" onClick={() => handleSort('start_date')}>
                      {sortConfig.key === 'start_date' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </button>
                  </th>
                  <th className="py-2 px-4 border-r">
                    Batas Akhir Pengerjaan
                    <button className="ml-1 text-xs" onClick={() => handleSort('due_date')}>
                      {sortConfig.key === 'due_date' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </button>
                  </th>
                  <th className="py-2 px-4">
                    Perlu Test Potensi Akademik
                    <button className="ml-1 text-xs" onClick={() => handleSort('test_tpa_id')}>
                      {sortConfig.key === 'test_tpa_id' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </button>
                  </th>
                  <th className="py-2 px-4">
                    Status
                    <button className="ml-1 text-xs" onClick={() => handleSort('counter')}>
                      {sortConfig.key === 'counter' && sortConfig.direction === 'ascending' ? '↑' : '↓'}
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
                    <td className="py-2 px-4 border-r">{item.id}</td>
                    <td className="py-2 px-4 border-r">{item.name}</td>
                    <td className="py-2 px-4 border-r">{item.matkul_name}</td>
                    <td className="py-2 px-4 border-r">{formatDateTimeHumanReadable(new Date(item.created_at))}</td>
                    <td className="py-2 px-4 border-r">{formatDateTimeHumanReadable(new Date(item.start_date))}</td>
                    <td className="py-2 px-4 border-r">{formatDateTimeHumanReadable(new Date(item.due_date))}</td>
                    <td className="py-2 px-4 border-r">{item.test_tpa_id > 0 ? "YA":"TIDAK"}</td>
                    <td className="py-2 px-4 border-r">{item.counter > 0 ? (item.status_pengerjaan == 1 ? "SEDANG DIKERJAKAN" : "SELESAI") :"BELUM DIKERJAKAN"}</td>
                    <td className="py-2 px-4">
                    {item.counter == 0 ?  
                      <Link 
                        href={{
                          pathname: item.need_test_tpa ? "/test/tpa" : "/test",
                          query: item
                        }}
                      ><button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Kerjakan</button></Link> : 
                      item.status_pengerjaan == 1 ? <button type="button" className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Lanjutkan</button> :
                      <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Lihat</button>
                    }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    );

}