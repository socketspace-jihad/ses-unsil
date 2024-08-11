'use client';

import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";

export default function Home() {

  const [nidn, setnidn] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const body = {nidn,password}
    axios.post("/api/admin-login",body)
    .then(resp=>{
      if(resp.status ==  200 || resp.status == 201) {
        router.push('/admin/tes-mata-kuliah');
      }
    })
    .catch(err=>{
      console.log(err)
    })
  };

  return (
    <main class="bg-gray-100 flex items-center justify-center h-screen">
      <div class="w-full max-w-xs">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <h2 class="mb-1 text-xl text-center font-bold text-gray-700">Smart Exam System</h2>
          <h4 class="mb-4 text-sm text-center text-gray-400">Universitas Siliwangi - Dosen</h4>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="nidn">
              Nomor Induk Dosen Nasional
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="nidn"
              type="text"
              placeholder="Nomor Induk Dosen Nasional"
              value={nidn}
              onChange={(e) => setnidn(e.target.value)}
            />  
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p class="text-red-500 text-xs italic">Please enter your password.</p>
          </div>
          <div class="flex items-center justify-between">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Login
            </button>
            <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Lupa Password?
            </a>
          </div>
        </form>
        <p class="text-center text-gray-500 text-xs">
          &copy;2024 PT. Transformasi Data Indonesia ( SocketSpace ). All rights reserved.
        </p>
      </div>
    </main>
  );
}
