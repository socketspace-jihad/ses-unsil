'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import DosenSidebar from '../../../../../components/dosen/sidebar';

function Modal({ message, isVisible }) {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default function CreateTestTPA() {
  const router = useRouter();

  const [examName, setExamName] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const savedExamData = localStorage.getItem('savedExamData');
    if (savedExamData) {
      const parsedData = JSON.parse(savedExamData);
      setExamName(parsedData.name || '');
      setExamDescription(parsedData.deskripsi || '');
      setQuestions(
        parsedData.soal.map((q) => ({
          question: q.soal,
          options: q.jawaban.map((opt) => ({
            answer: opt.jawaban,
            score: opt.score,
            explanation: opt.penjelasan,
          })),
        }))
      );
    }
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.65;
      speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech Synthesis API is not supported in this browser.');
    }
  };

  const addQuestion = () => {
    if (questions.length > 0) {
      const lastQuestion = questions[questions.length - 1];
      if (!lastQuestion.question.trim() || lastQuestion.options.length === 0) {
        alert('Please complete the current question before adding a new one.');
        return;
      }
    }
    setQuestions([...questions, { question: '', options: [] }]);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ answer: '', score: 0, explanation: '' });
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex][field] = value;
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const deleteOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.question.trim()) {
        alert(`Pertanyaan ${i + 1} tidak boleh kosong.`);
        return;
      }
      for (var option of question.options) {
        if (option.answer === '') {
          alert(`Pertanyaan ${i + 1} tidak boleh memiliki jawaban yang kosong.`);
          return;
        }
      }
      if (question.options.length === 0) {
        alert(`Pertanyaan ${i + 1} harus memiliki setidaknya satu opsi jawaban.`);
        return;
      }
    }

    const examData = {
      name: examName,
      deskripsi: examDescription,
      soal: questions.map((q) => ({
        soal: q.question,
        jawaban: q.options.map((opt) => ({
          jawaban: opt.answer,
          score: parseInt(opt.score),
          penjelasan: opt.explanation,
        })),
      })),
    };

    setModalMessage('Mohon tunggu...');
    setIsModalVisible(true);

    axios
      .post('/api/dosen/create-test-tpa', examData)
      .then((response) => {
        setModalMessage('Ujian berhasil dibuat!');
        setTimeout(() => {
          localStorage.removeItem('savedExamData');
          router.push('/admin/tes-potensi-akademik');
        }, 2000);
      })
      .catch((error) => {
        setModalMessage('Terjadi kesalahan saat membuat ujian.');
        console.error('Error creating exam:', error);
      })
      .finally(() => {
        setTimeout(() => {
          setIsModalVisible(false);
        }, 2000);
      });
  };

  const handleSave = () => {
    const examData = {
      name: examName,
      deskripsi: examDescription,
      soal: questions.map((q) => ({
        soal: q.question,
        jawaban: q.options.map((opt) => ({
          jawaban: opt.answer,
          score: parseInt(opt.score),
          penjelasan: opt.explanation,
        })),
      })),
    };

    localStorage.setItem('savedExamData', JSON.stringify(examData));
    alert('Data ujian telah disimpan!');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Modal message={modalMessage} isVisible={isModalVisible} />
      <DosenSidebar/>
      <main className="flex-1 p-6 text-black">
        <div className="bg-white shadow-md rounded p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Membuat Ujian TPA yang baru</h2>
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2">Nama Ujian</label>
            <div className="flex items-center">
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Masukkan nama ujian"
              />
              <button
                onClick={() => speak(examName)}
                className="ml-2 bg-blue-500 text-white p-2 rounded"
              >
                🔊
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2">Deskripsi Ujian</label>
            <div className="flex items-center">
              <textarea
                value={examDescription}
                onChange={(e) => setExamDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Masukkan deskripsi ujian"
              />
              <button
                onClick={() => speak(examDescription)}
                className="ml-2 bg-blue-500 text-white p-2 rounded"
              >
                🔊
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Pertanyaan</h3>
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-4 border p-4 rounded">
              {qIndex + 1}.
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={`Soal ${qIndex + 1}`}
                />
                <button
                  onClick={() => speak(q.question)}
                  className="ml-2 bg-blue-500 text-white p-2 rounded"
                >
                  🔊
                </button>
                <button
                  onClick={() => deleteQuestion(qIndex)}
                  className="ml-2 bg-red-500 text-white p-2 rounded"
                >
                  🗑️
                </button>
              </div>
              <button
                onClick={() => addOption(qIndex)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
              >
                Tambah Opsi Jawaban
              </button>
              {q.options.map((option, oIndex) => (
                <div key={oIndex} className="bg-gray-50 p-2 mb-2 rounded shadow-inner">
                  <div className="flex items-center mb-2">
                    <input
                      type="text"
                      value={option.answer}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, 'answer', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder={`Jawaban ${oIndex + 1}`}
                    />
                    <button
                      onClick={() => speak(option.answer)}
                      className="ml-2 bg-blue-500 text-white p-2 rounded"
                    >
                      🔊
                    </button>
                    <button
                      onClick={() => deleteOption(qIndex, oIndex)}
                      className="ml-2 bg-red-500 text-white p-2 rounded"
                    >
                      🗑️
                    </button>
                  </div>
                  <label>Skor</label>
                  <input
                    type="number"
                    value={option.score}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, 'score', e.target.value)}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                    placeholder="Score"
                    defaultValue={0}
                  />
                  <textarea
                    value={option.explanation}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, 'explanation', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Penjelasan"
                  />
                </div>
              ))}
            </div>
          ))}
          <button
            onClick={addQuestion}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-6"
          >
            Tambah Pertanyaan
          </button>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            className="bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-600"
          >
            Simpan
          </button>
          <button
            onClick={handleSubmit}
            className="bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600"
          >
            Buat Ujian
          </button>
        </div>
      </main>
    </div>
  );
}
