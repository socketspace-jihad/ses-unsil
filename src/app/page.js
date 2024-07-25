'use client';

export default function Home() {

  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 fixed w-full z-10">
        <div className="container mx-auto flex items-center">
          <div className="text-white font-bold mr-4">
            <a href="/auth/login">Mahasiswa</a>
          </div>
          <div className="text-white font-bold mr-4">
            <a href="/admin/auth">Dosen</a>
          </div>
          <div id="features" className="text-white font-bold cursor-pointer" onClick={scrollToFeatures}>
            Fitur
          </div>
        </div>
      </nav>

      {/* Jumbotron */}
      <div className="relative h-screen flex items-center justify-center">
        <video 
          autoPlay 
          loop 
          muted 
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/education.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white">Universitas Siliwangi</h1>
          <h3 className="text-2xl mb-4">Program Studi Manajemen Mutu Halal</h3>
          <hr className="mb-3"/>
          <h1 className="text-4xl font-bold text-white">Smart Exam System</h1>
          <p className="text-xl mb-8 text-white">Platform Ujian yang Adaptif untuk Mahasiswa</p>
          <a href="/auth/login"><button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Masuk sebagai Mahasiswa</button></a>
          <a href="/admin/auth"><button type="button" className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900">Masuk sebagai Dosen</button>  </a>
         </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Fitur Cards */}
      <div className="container mx-auto my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-black">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Ujian yang Adaptif</h2>
          <p>Tingkat kesulitan soal akan disesuaikan dengan nilai TPA</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Text-to-Speech Test</h2>
          <p>Membantu mahasiswa dengan disabilitas tunanetra memahami soal</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Voice Based Answer</h2>
          <p>Membantu mahasiswa tunanetra untuk menentukan jawaban dari ujian</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Manajemen Skor</h2>
          <p>Memudahkan Dosen untuk mengatur, memasukan, dan memantau ujian Mahasiswa</p>
        </div>
      </div>
    </div>
  );
}
