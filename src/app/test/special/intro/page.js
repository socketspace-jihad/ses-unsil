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

  const [buttonDisabled,setButtonDisabled] = useState(false);
  const [buttonText,setButtonText] = useState("Pilih Mata Kuliah terlebih dahulu");

  const [mahasiswaTestData,setMahasiswaTestData] = useState([]);
  const [mahasiswaTestKind, setMahasiswaTestKind] = useState('');

  const [kelasInputDisabled, setKelasInputDisabled] = useState(true);
  const [kelas, setKelas] = useState('');

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

    // harus create dlu biar dapet ID mahasiswa testnya
    const data = JSON.parse(selectedExam);
    if(mahasiswaTestKind == "tpa") {
        if(mahasiswaTestData.testTPA.length == 0){
            axios.post("/api/special/create-mahasiswa-test-tpa",{
                "test_tpa_id": data.test_tpa_id,
                "kelas":kelas
            })
            .then(resp=>{
                router.push(`/test/special/detail?test_matkul_id=${data.id}&mahasiswa_test_tpa_id=${resp.data.insertId}&kelas=${kelas}`);
            })
            .catch(err=>{
                console.log(err)
            })
        } else {
            router.push(`/test/special/detail?test_matkul_id=${data.id}&mahasiswa_test_tpa_id=${mahasiswaTestData.testTPA[0].id}&kelas=${kelas}`);
        }
    } else {
        if(mahasiswaTestData.testMatkul.length == 0){
            axios.post("/api/special/direct-create-mahasiswa-test-matkul",{
                "test_matkul_id": data.id,
                "score": mahasiswaTestData.testTPA[0].score,
                "nama_kelas":kelas
            })
            .then(resp=>{
                router.push(`/test/special/matkul/detail?test_matkul_id=${data.id}&mahasiswa_test_matkul_id=${resp.data.insertId}&kelas=${kelas}&test_matkul_categorized_id=${resp.data.categorized_id}`);
            })
            .catch(err=>{
                console.log(err)
            })
        } else {
            router.push(`/test/special/matkul/detail?test_matkul_id=${data.id}&mahasiswa_test_matkul_id=${mahasiswaTestData.testMatkul[0].id}&kelas=${kelas}&test_matkul_categorized_id=${mahasiswaTestData.testMatkul[0].test_matkul_categorized_id}`);
        }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChooseExam = (val) =>{
    const data = JSON.parse(val);
    axios.get("/api/dosen/mahasiswa/get-mahasiswa-test-tpa",{
        params:{
            "test_matkul_id":data.id,
            "test_tpa_id":data.test_tpa_id
        }
    })
    .then(resp=>{
        console.log(resp);
        if(resp.data.kind == "tpa") {
            if(resp.data.testTPA.length == 0){
                setKelasInputDisabled(false);
            } else {
                setKelas(resp.data.testTPA[0].kelas);
            }
            setMahasiswaTestData(resp.data);
            setMahasiswaTestKind("tpa");
            setButtonText("Kerjakan Tes TPA")
            return
        }
        setKelas(resp.data.testTPA[0].kelas)
        setKelasInputDisabled(true);
        setMahasiswaTestData(resp.data);
        setMahasiswaTestKind("matkul");
        setButtonText("Kerjakan Tes Mata Kuliah")
    })
    .catch(err=>{
        console.log(err);
    })
    setSelectedExam(val);
  }

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
              onChange={(e) => {
                handleChooseExam(e.target.value)
              }}
              disabled={loading}
            >
              <option value="">Pilih Ujian</option>
              {exams.map((exam) => (
                <option key={exam.id} value={JSON.stringify(exam)}>
                  {exam.name}
                </option>
              ))}
            </select>

            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kelas">
              Kelas
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="kelas"
              type="text"
              placeholder="Masukkan nama Kelas"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              disabled={kelasInputDisabled}
            />  
            
            <h4 className="mt-4 font-bold text-sm text-black">- Pastikan Mahasiswa sudah siap</h4>
            <h4 className="mt-1 font-bold text-sm text-black">- Pastikan Mahasiswa sudah menggunakan Headset</h4>
            <h4 className="mt-1 mb-4 font-bold text-sm text-black">- Ujian akan langsung dimulai</h4>
          </div>
          <div className="flex items-center justify-between">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="submit"
              disabled={()=>{
                if(loading || disabled){
                    return true
                }
                return false
              }}
            >
              {buttonText}
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
