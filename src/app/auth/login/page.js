'use client';

import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  const [npm, setNPM] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Tambahkan state loading
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Set loading menjadi true ketika submit ditekan
    console.log("SUBMITED");
    try {
      const response = await axios.post('/api/login', { npm, password });
      console.log(response.body);
      if (response.status === 200) {
        router.push('/dashboard'); // Ubah ke halaman tujuan setelah login berhasil
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.log(err);
      setError('Invalid email or password');
    } finally {
      setLoading(false); // Set loading menjadi false setelah proses selesai
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
          <h4 className="mb-4 text-sm text-center text-gray-400">Universitas Siliwangi - Mahasiswa</h4>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="npm">
              Nomor Induk Mahasiswa
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="npm"
              type="text"
              placeholder="Nomor Pokok Mahasiswa"
              value={npm}
              onChange={(e) => setNPM(e.target.value)}
              disabled={loading} // Disable input saat loading
            />  
          </div>
          <div className="mb-6">
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
                disabled={loading} // Disable input saat loading
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                disabled={loading} // Disable button saat loading
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="text-red-500 text-xs italic">Please enter your password.</p>
          </div>
          <div className="flex items-center justify-between">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="submit"
              disabled={loading} // Disable button saat loading
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Lupa Password?
            </a>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2024 PT. Transformasi Data Indonesia ( SocketSpace ). All rights reserved.
        </p>
      </div>
    </main>
  );
}
