"use client"
import { useEffect, useRef, useState } from 'react';

const SoundWave = ({ text, options, onFinish, setStatus }) => {
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
      setDisplayedText('');
      setNotification('');
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      speakOptions();
    };

    speechSynthesis.speak(utterance);
  };

  const speakOptions = () => {
    const optionsText = options.map((option, index) => `${String.fromCharCode(65 + index)}: ${option.text}`).join('. ');
    const utterance = new SpeechSynthesisUtterance(`Opsi jawaban adalah ${optionsText}... dan katakan "Saya minta ulangi" untuk mengulangi pertanyaan dan katakan "Saya ingin lanjut" untuk melewati pertanyaan`);
    utterance.lang = 'id-ID';
    utterance.rate = 0.5;
    utterance.onend = () =>{
      startRecognition();
    }
    speechSynthesis.speak(utterance);
  };

  const startRecognition = () => {
    if (recognition) {
      if (recognition.state === 'running') {
        return; // Avoid starting another session if already running
      } else {
        recognition.stop(); // Stop any previous session before starting a new one
      }
    }
  
    const newRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    newRecognition.lang = 'id-ID';
    newRecognition.interimResults = false;
    newRecognition.continuous = true;
    newRecognition.onresult =async (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const match = transcript.match(/saya pilih ([a-z])/);
      if (match) {
        const optionIndex = match[1].toUpperCase().charCodeAt(0) - 65;
        if (optionIndex >= 0 && optionIndex < options.length) {
          const audio = new Audio("/confirmed.mp3")
          await audio.play();
          setStatus('loading');
          speechSynthesis.cancel();
          newRecognition.stop();
          setNotification('');
          onFinish(optionIndex);
        } else {
          speechSynthesis.cancel();
          setNotification('Pilihan tidak valid. Silakan pilih dari opsi A, B, C, dan seterusnya.');
          newRecognition.stop();
          speakNotification(notification);
        }
      } else {
        if(transcript.includes("ulang")){
            speechSynthesis.cancel();
            newRecognition.stop();
            speakText();
        } else if(transcript.includes("lanjut")) {
            setStatus('loading');
            speechSynthesis.cancel();
            newRecognition.stop();
            setNotification('');
            onFinish(null); // Proceed without an answer
        } else {
            speechSynthesis.cancel();
            newRecognition.stop();
            setNotification('Sistem tidak mengerti. Hanya ada dua opsi: katakan "Saya Mengerti" untuk lanjut atau "Saya Minta Ulangi" untuk mengulang.');
            speakNotification(notification);
        }
      }
    };
    newRecognition.onerror = (event) => {
      console.error(event.error);
    };
    setRecognition(newRecognition);
    newRecognition.start();
  };
  
  

  const speakNotification = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'id-ID';
    utterance.rate = 0.5;
    utterance.onend = () => {
      startRecognition();
    };

    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let interval;
    if (isSpeaking) {
      interval = setInterval(() => {
        barsRef.current.forEach((bar, index) => {
          const randomHeight = Math.random() * 100;
          bar.style.height = `${randomHeight}%`;
        });

        if (textIndexRef.current < text.length-1) {
          setDisplayedText((prev) => prev + text[textIndexRef.current]);
          textIndexRef.current++;
        }
      }, 70);
    } else {
      barsRef.current.forEach((bar) => (bar.style.height = '50%'));
    }

    return () => clearInterval(interval);
  }, [isSpeaking, text]);

  const hasSpoken = useRef(false);

  useEffect(() => {
    if (text && options.length && !hasSpoken.current) {
      speakText();
      hasSpoken.current = true; // Ensure speakText is only called once
    }
  }, [text, options]);
  
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);
  

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
    </div>
  );
};

export default SoundWave;
