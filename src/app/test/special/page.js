'use client';

import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  const [npm, setNPM] = useState('');
  const [nidn, setNIDN] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log("SUBMITED");
    try {
      const response = await axios.post('/api/special/entry-test', { npm, password,nidn });
      if (response.status === 200) {
        router.push('/test/special/intro');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.log(err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="npm">
              Nomor Induk Dosen / Admin ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="nidn"
              type="text"
              placeholder="Nomor Induk Dosen / Admin ID"
              value={nidn}
              onChange={(e) => setNIDN(e.target.value)}
              disabled={loading}
            />  
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                disabled={loading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="text-red-500 text-xs italic">Please enter your password.</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentNPM">
              NPM Mahasiswa
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="studentNPM"
              type="text"
              placeholder="Masukkan NPM Mahasiswa"
              value={npm}
              onChange={(e) => setNPM(e.target.value)}
              disabled={loading}
            />
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
