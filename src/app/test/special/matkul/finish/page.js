"use client"
import axios from 'axios';
import cookies from 'next-cookies';
import { useSearchParams, useRouter } from 'next/navigation';
import { destroyCookie, setCookie } from 'nookies';
import { useEffect, useRef, useState } from 'react';

const SoundWave = ({ text, onFinish, setStatus }) => {

  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [notification, setNotification] = useState('');
  const barsRef = useRef([]);
  const textIndexRef = useRef(0);
  const [recognition, setRecognition] = useState(null);

  const speakText = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.5;
    utterance.onstart = () => {
      setIsSpeaking(true);
      textIndexRef.current = 0;
      setDisplayedText(''); // Reset displayed text
      setNotification(''); // Clear any previous notifications
    };
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  const speakNotification = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'id-ID';
    utterance.rate = 0.5;
    utterance.onend = () => {
    };

    speechSynthesis.speak(utterance);
  };

  const startRecognition = () => {
    if (recognition) {
      recognition.start();
    } else {
      const newRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      newRecognition.lang = 'id-ID';
      newRecognition.interimResults = false;
      newRecognition.continuous = true; // Continuously listen until explicitly stopped
      newRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        if (transcript.includes("ulang")) {
          newRecognition.stop(); // Stop recognition if "Ulangi" is recognized
          speakText(); // Re-read the text if "Ulangi" is recognized
        } else if (transcript.includes("mengerti")) {
          newRecognition.stop(); // Stop recognition if "Mengerti" is recognized
          onFinish(); // Handle "Mengerti" case
        } else {
          // Notify user that the input is not understood and restart recognition
          setNotification('Sistem tidak mengerti. Hanya ada dua opsi: katakan "Saya Mengerti" untuk lanjut atau "Saya Minta Ulangi" untuk mengulang.');
          speakNotification(notification); // Read out the notification
        }
      };
      newRecognition.onerror = (event) => {
        console.error(event.error);
      };
      setRecognition(newRecognition);
      newRecognition.start();
    }
  };

  useEffect(() => {
    let interval;
    if (isSpeaking) {
      interval = setInterval(() => {
        barsRef.current.forEach((bar, index) => {
          const randomHeight = Math.random() * 100;
          bar.style.height = `${randomHeight}%`;
        });

        if (textIndexRef.current < text.length - 1) {
          setDisplayedText((prev) => prev + text[textIndexRef.current]);
          textIndexRef.current++;
        }
      }, 70);
    } else {
      barsRef.current.forEach((bar) => (bar.style.height = '50%'));
    }

    return () => clearInterval(interval);
  }, [isSpeaking, text]);

  // Automatically start speaking when text changes
  useEffect(() => {
    if (text) {
      speakText();
    }
  }, [text]);

  const handleLogout = () => {
    setCookie(null, "auth-token", null, { path: "/" });
    router.push("/test/special");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <div className="w-1/2 h-1/2 flex justify-around items-end bg-gradient-to-r from-blue-400 to-purple-500 p-4 rounded-xl">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (barsRef.current[i] = el)}
            className="w-2 bg-white rounded"
            style={{ height: '50%', transition: 'height 0.1s ease' }}
          ></div>
        ))}
      </div>
      <div className="mt-4 text-lg font-mono text-gray-800 p-5">
        {displayedText}
      </div>
      {notification && (
        <div className="mt-4 p-4 bg-red-300 text-red-800 rounded-lg">
          {notification}
        </div>
      )}
      <div className="mt-8 flex space-x-4">
        <button
          className="p-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
          onClick={speakText}
        >
          Bacakan Paragraf
        </button>
        <button
          className="p-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700"
          onClick={handleLogout}
        >
          Keluar
        </button>
      </div>
    </div>
  );
};

export default function Home() {

  const router = useRouter();

  const params = useSearchParams();

  const [exam, setExam] = useState({});
  const [narration, setNarration] = useState('');

  useEffect(() => {
    axios.get("/api/special/test-matkul-by-id", {
      params: {
        "test_matkul_id": params.get("test_matkul_id")
      }
    })
      .then(resp => {
        let data = resp.data.rows[0];
        setExam(data);
        setNarration(`
            Selamat!, Ujian Tes Mata Kuliah telah selesai.
            Silakan hubungi Admin Smart Exam Sistem dan Meninggalkan tempat Ujian.
            Terimakasih, Semoga Beruntung!.`);
      })
      .catch(err => {
        console.log(err)
      })
  }, [params]);

  const handleFinish = () => {
    // Handle the case when the user says "Mengerti"
    // router.push(`/test/special/session?test_tpa_id=${exam.test_tpa_id}&mahasiswa_test_tpa_id=${params.get("mahasiswa_test_tpa_id")}`);
    console.log("OK");
  };

  return (
    <div>
      <SoundWave text={narration} onFinish={handleFinish} />
    </div>
  );
}
