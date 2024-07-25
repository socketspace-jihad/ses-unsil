// pages/mulai-ujian.js
"use client"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const Session = (props) => {
  const router = useRouter();
    
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem('answers');
    return savedAnswers ? JSON.parse(savedAnswers) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    axios.get("/api/test-matkul",{
        params: {
            "test_matkul_categorized_id":props.searchParams.test_matkul_categorized_id
        }
    })
      .then(response => {
        const fetchedQuestions = [];
        const currentQuestion = {};
        response.data.rows.forEach(row => {
          if (!currentQuestion[row.question_id]) {
            currentQuestion[row.question_id] = {
              id: row.question_id,
              question: row.question,
              options: []
            };
            fetchedQuestions.push(currentQuestion[row.question_id]);
          }
          currentQuestion[row.question_id].options.push({
            id: row.option_id,
            text: row.option
          });
        });
        setQuestions(fetchedQuestions);
      })
      .catch(err => {
        if(err.response.status == 401) {
            router.push("/auth/login");
        }
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  const handleAnswer = (index) => {
    console.log(index);
    const newAnswers = [...answers];
    
    // Jika jawaban yang dipilih adalah jawaban yang sudah ada, set ke null
    if (newAnswers[currentQuestion] === index) {
      newAnswers[currentQuestion] = null;  // Mengatur jawaban menjadi tidak terjawab
    } else {
      newAnswers[currentQuestion] = index; // Mengatur jawaban baru
    }
  
    setAnswers(newAnswers);
  };
  

  const handleNext = () => {
    setCurrentQuestion((prev) => (prev < questions.length - 1 ? prev + 1 : prev));
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestion(index);
  };

  const handleSubmit = () => {
    const unanswered = questions
      .map((q, index) => (answers[index] === null ? index : null))
      .filter(index => index !== null);
    setUnansweredQuestions(unanswered);
    setShowModal(true);
  };

  const handleVoiceAnswer = (option) => {
    const optionIndex = optionPrefix.indexOf(option);
    if (optionIndex !== -1 && optionIndex < questions[currentQuestion].options.length) {
      handleAnswer(optionIndex);
    } else {
      alert('Pilihan tidak valid, sebutkan hanya huruf A, B, C, dan seterusnya.');
    }
  };


  const confirmSubmit = () => {
    // Mendapatkan semua jawaban beserta ID soal dan ID jawabannya, tetapi hanya yang sudah dijawab
    const submittedAnswers = questions.reduce((acc, question, index) => {
      const selectedOption = question.options[answers[index]];
      if (selectedOption) {
        acc.push({
          question_id: question.id,
          answer_id: selectedOption.id
        });
      }
      return acc;
    }, []);
  
    // Mencetak jawaban ke console
    console.log("Jawaban yang disubmit:", submittedAnswers);
  
    setShowModal(false);
    alert('Jawaban Anda telah disubmit!');
    // Logika submit jawaban bisa ditambahkan di sini
  };
  
  const cancelSubmit = () => {
    setShowModal(false);
  };

  const goToUnansweredQuestion = (index) => {
    setCurrentQuestion(index);
    setShowModal(false);
  };

  const handleTTS = () => {
    const utterance = new SpeechSynthesisUtterance();
    const currentQ = questions[currentQuestion];
    utterance.text = `${currentQuestion + 1}. ${currentQ.question}. `;
    currentQ.options.forEach((option, index) => {
      utterance.text += `${optionPrefix[index]}. ${option.text}. `;
    });
    utterance.lang = 'id-ID';
    utterance.rate = 0.5;
    window.speechSynthesis.speak(utterance);
  };

  const handleVTT = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Browser ini tidak mendukung Web Speech API');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim().toUpperCase();
        const words = transcript.split(" ");
        const option = words[words.length - 1];
        handleVoiceAnswer(option);
        setListening(false);
    };
    

    recognition.onerror = (event) => {
        console.log(event.results)
      console.error(event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const optionPrefix = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-black p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Ujian</h1>
          <p className="text-xl text-gray-700">Menyiapkan Ujian ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row justify-center items-start text-black p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Ujian</h1>
        <div className="mb-6">
          <p className="text-xl mb-4">{`${currentQuestion + 1}. ${questions[currentQuestion].question}`}</p>
          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(index)}
                className={`py-3 px-4 rounded-lg border transition duration-300 ${
                  answers[currentQuestion] === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                {`${optionPrefix[index]}. ${option.text}`}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrevious}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
          >
            Previous
          </button>
          <button
            onClick={handleTTS}
            className="bg-blue-300 text-white py-2 px-4 rounded-lg hover:bg-blue-400 transition duration-300"
          >
            Baca Soal
          </button>
          <button
            onClick={handleVTT}
            className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ${listening ? 'opacity-50' : ''}`}
            disabled={listening}
          >
            Jawab dengan Suara
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Next
          </button>
        </div>
      </div>
      <div className="ml-10 mt-10">
        <div className="grid grid-cols-5 gap-2 mb-4">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(index)}
              className={`w-12 h-12 rounded-full transition duration-300 ${
                currentQuestion === index
                  ? 'bg-yellow-500 text-white'
                  : answers[index] !== null ? 'bg-green-500 text-white' : 'bg-gray-300 text-black hover:bg-gray-400'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white py-2 px-4 rounded-lg w-full hover:bg-green-600 transition duration-300"
        >
          Submit
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {unansweredQuestions.length > 0
                ? 'Ada soal yang belum terjawab, anda yakin submit saja?'
                : 'Anda yakin akan men-submit semua jawaban?'}
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelSubmit}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Tidak
              </button>
              {unansweredQuestions.length > 0 && (
                <button
                  onClick={() => goToUnansweredQuestion(unansweredQuestions[0])}
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
                >
                  Lihat Soal
                </button>
              )}
              <button
                onClick={confirmSubmit}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Session;
