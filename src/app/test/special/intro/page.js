'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  const [selectedExam, setSelectedExam] = useState('');
  const [exams, setExams] = useState([]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    axios.get("/api/special/test-matkul")
      .then(resp => {
        setExams(resp.data.rows);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi apakah ujian telah dipilih
    if (!selectedExam) {
      setError('Silakan pilih ujian mata kuliah terlebih dahulu.');
      return;
    }

    setLoading(true)
    router.push('/test/special/detail?test_matkul_id='+selectedExam);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <h2 className="mb-1 text-xl text-center font-bold text-gray-700">Smart Exam System</h2>
          <h4 className="mb-4 text-sm text-center text-gray-400">Sistem Ujian Untuk Mahasiswa Tunanetra</h4>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="selectedExam">
              Pilih Ujian Mata Kuliah
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="selectedExam"
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              disabled={loading}
            >
              <option value="">Pilih Ujian</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
            
            <h4 className="mt-4 font-bold text-sm text-black">- Pastikan Mahasiswa sudah siap</h4>
            <h4 className="mt-1 font-bold text-sm text-black">- Pastikan Mahasiswa sudah menggunakan Headset</h4>
            <h4 className="mt-1 mb-4 font-bold text-sm text-black">- Ujian akan langsung dimulai</h4>
          </div>
          <div className="flex items-center justify-between">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Menyiapkan...' : 'Mulai Ujian'}
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2024 PT. Transformasi Data Indonesia ( SocketSpace ). All rights reserved.
        </p>
      </div>
    </main>
  );
}
