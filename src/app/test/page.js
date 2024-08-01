// pages/ujian.js
"use client"

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDateTimeHumanReadable } from '../../../utils/dateFormat';

const Ujian = (props) => {
  const router = useRouter();

  const params = useSearchParams();

  const handleStart = () => {
    router.push('/test/session?test_matkul_categorized_id='+params.get("test_matkul_categorized_id")+'&mahasiswa_test_matkul_id='+params.get("mahasiswa_test_matkul_id")); // Ganti dengan halaman ujian sebenarnya
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-black">
        <h1 className="text-2xl font-bold">{params.get("name")}</h1>
        <h3 className="mb-4">Mata Kuliah: {params.get("matkul_name")}</h3>
        <hr className="mb-3"/>
        <p className="text-gray-700 mb-6">
         {params.get("deskripsi")}
        </p>
        <p className="text-gray-700 mb-6">
         Mulai : {formatDateTimeHumanReadable(new Date(params.get("start_date")))}
        </p>
        <p className="text-gray-700 mb-6">
         Terakhir : {formatDateTimeHumanReadable(new Date(params.get("due_date")))}
        </p>
        <button
          onClick={handleStart}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Mulai
        </button>
      </div>
    </div>
  );
};

export default Ujian;
