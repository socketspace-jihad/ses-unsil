// pages/ujian.js
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDateTimeHumanReadable } from '../../../../utils/dateFormat';
import axios from 'axios';

const Ujian = (props) => {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [kelas, setKelas] = useState("");
  const [error, setError] = useState("");

  const params = useSearchParams();

  useEffect(() => {
    axios({
        url: "/api/test-data-tpa",
        params: {
            "ok": 1,
            "test_tpa_id": params.get("test_tpa_id"),
            "test_matkul_id":params.get("id")
        },
        method: "GET"
    })
    .then(response => {
        setData(response.data.rows);
    })
    .catch(err => console.log(err));
  }, [params.get("test_tpa_id")]);

  const handleStartTPA = () => {
    if (kelas.trim() === "") {
        setError("Kelas wajib diisi");
        return;
    }

    if (data.length !== 0) {
        if(data[0].status_pengerjaan != 0){
            router.push('/test/session?&mahasiswa_test_matkul_id='+params.get("mahasiswa_test_matkul_id"));
            return;
        }
        router.push('/test/tpa/session?test_tpa_id=' + params.get("test_tpa_id")+'&mahasiswa_test_tpa_id='+ params.get("id")); 
        return;
    }
    axios.post("/api/prepare-test-tpa",{
        "test_tpa_id":params.get("test_tpa_id")
        ,kelas})
    .then(resp=>{
        router.push('/test/tpa/session?test_tpa_id=' + params.get("test_tpa_id")+'&mahasiswa_test_tpa_id='+resp.data.rows.insertId); 
    })
    .catch(err=>alert("Tidak dapat memulai Tes"));// Ganti dengan halaman ujian sebenarnya
  };

  const handleStartTestMatkul = () => {
    axios({
      url: "/api/test-matkul-categorized",
      data: {
          "ok": 1,
          "test_matkul_id": params.get("id"),
          "tpa_score":data[0].score,
          "kelas":kelas
      },
      method: "POST"
  })
  .then(response => {
      router.push('/test/session?test_matkul_categorized_id='+response.data.test_matkul_categorized_id+'&mahasiswa_test_matkul_id='+response.data.mahasiswa_test_matkul_id);
  })
  .catch(err => console.log(err));
  }

  const handleKelasChange = (event) => {
    setKelas(event.target.value);
    setError(""); // Reset error when user starts typing
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-black">
        <h1 className="text-2xl font-bold">{params.get("name")}</h1>
        <h3 className="mb-4">Mata Kuliah: {params.get("matkul_name")}</h3>
        <hr className="mb-3" />
        <p className="text-gray-700 mb-6">
          {params.get("deskripsi")}
        </p>
        <p className="text-gray-700 mb-6">
          Mulai : {formatDateTimeHumanReadable(new Date(params.get("start_date")))}
        </p>
        <p className="text-gray-700 mb-6">
          Terakhir : {formatDateTimeHumanReadable(new Date(params.get("due_date")))}
        </p>
        <p className="text-gray-700 mb-6">
          Status Pengerjaan Test TPA : {data.length !== 0 ? "Sudah Mengerjakan TPA" : "Belum Mengerjakan TPA"}
        </p>
        {data.length !== 0 ? <p>Skor TPA: {data[0].score}</p> : <></>}
        
        <div className="mb-6">
          <label htmlFor="kelas" className="block text-gray-700">Kelas:</label>
          <input
            type="text"
            id="kelas"
            value={kelas}
            onChange={handleKelasChange}
            className="w-full p-2 border rounded"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>
        
        <button
          onClick={data.length !== 0 ? (data[0].status_pengerjaan != 0 ? handleStartTestMatkul : handleStartTPA) : handleStartTPA }
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          {data.length !== 0 ? (data[0].status_pengerjaan != 0 ? "Kerjakan Tes Mata Kuliah" : "Teruskan Tes TPA") : "Kerjakan Tes TPA"}
        </button>
      </div>
    </div>
  );
};

export default Ujian;
