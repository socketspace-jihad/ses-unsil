'use client'

import React, { useEffect, useState } from 'react';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    // Mengambil daftar suara yang tersedia
    const handleVoicesChanged = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    handleVoicesChanged();
  }, []);

  const speak = () => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'id-ID';
    speech.rate = .5;

    // Pilih suara yang sesuai dengan Bahasa Indonesia
    const indonesianVoice = voices.find((voice) => voice.lang === 'id-ID');
    if (indonesianVoice) {
      speech.voice = indonesianVoice;
    }

    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Text to Speech</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows="10"
        placeholder="Masukkan teks di sini..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={speak}
      >
        Baca Teks
      </button>
    </div>
  );
};

export default TextToSpeech;
