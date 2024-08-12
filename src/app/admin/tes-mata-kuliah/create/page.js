'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import DosenSidebar from '../../../../../components/dosen/sidebar';
import TabBar from './tabbar'; // Import the TabBar component

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
  const [selectedTestTPA, setSelectedTestTPA] = useState(''); // New state for dropdown
  const [tabs, setTabs] = useState([
    { title: '', scoreLowerBound: '', scoreUpperBound: '', questions: [] }
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [testTPA, setTestTPA] = useState([]);

  useEffect(() => {
    const savedExamData = localStorage.getItem('savedExamData');
    if (savedExamData) {
      const parsedData = JSON.parse(savedExamData);

      // Add safety checks before mapping
      if (parsedData && parsedData.categorized) {
        setExamName(parsedData.name || '');
        setExamDescription(parsedData.deskripsi || '');
        setTabs(
          parsedData.categorized.map((cat) => ({
            title: '',
            scoreLowerBound: cat.score_lower_limit || '',
            scoreUpperBound: cat.score_upper_limit || '',
            questions: cat.soal.map((q) => ({
              question: q.soal,
              options: q.jawaban.map((opt) => ({
                answer: opt.jawaban,
                score: opt.score,
                explanation: opt.penjelasan,
              })),
            })),
          }))
        );
      } else {
        console.error('Invalid saved exam data format.');
      }
    }

    axios.get("/api/dosen/test-tpa")
    .then(resp => {
        setTestTPA(resp.data.rows);
    })
    .catch(err => {
        console.log(err);
    });
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

  const addOption = (questionIndex) => {
    const newTabs = [...tabs];
    newTabs[activeTab].questions[questionIndex].options.push({
      answer: '',
      score: '',
      explanation: ''
    });
    setTabs(newTabs);
  };

  const addTab = () => {
    setTabs([
      ...tabs,
      { title: '', scoreLowerBound: '', scoreUpperBound: '', questions: [] }
    ]);
    setActiveTab(tabs.length);
  };

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const addQuestion = () => {
    const newTabs = [...tabs];
    newTabs[activeTab].questions.push({ question: '', options: [] });
    setTabs(newTabs);
  };

  const handleQuestionChange = (index, value) => {
    const newTabs = [...tabs];
    newTabs[activeTab].questions[index].question = value;
    setTabs(newTabs);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const newTabs = [...tabs];
    newTabs[activeTab].questions[qIndex].options[oIndex][field] = value;
    setTabs(newTabs);
  };

  const deleteQuestion = (index) => {
    const newTabs = [...tabs];
    newTabs[activeTab].questions = newTabs[activeTab].questions.filter((_, i) => i !== index);
    setTabs(newTabs);
  };

  const deleteOption = (qIndex, oIndex) => {
    const newTabs = [...tabs];
    newTabs[activeTab].questions[qIndex].options = newTabs[activeTab].questions[qIndex].options.filter((_, i) => i !== oIndex);
    setTabs(newTabs);
  };

  const handleSubmit = () => {
    if (!selectedTestTPA) { // Validate if dropdown is selected
      alert('Pilih Test TPA terlebih dahulu.');
      return;
    }

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      for (let j = 0; j < tab.questions.length; j++) {
        const question = tab.questions[j];
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
    }

    const examData = {
      name: examName,
      deskripsi: examDescription,
      test_tpa_id: selectedTestTPA,
      categorized: tabs.map((tab) => ({
        score_lower_limit: tab.scoreLowerBound,
        score_upper_limit: tab.scoreUpperBound,
        soal: tab.questions.map((q) => ({
          soal: q.question,
          jawaban: q.options.map((opt) => ({
            jawaban: opt.answer,
            score: opt.score,
            penjelasan: opt.explanation,
          })),
        })),
      })),
    };

    setModalMessage('Mohon tunggu...');
    setIsModalVisible(true);
    console.log(examData);
    // axios
    //   .post('/api/dosen/create-test-tpa', examData)
    //   .then((response) => {
    //     setModalMessage('Ujian berhasil dibuat!');
    //     setTimeout(() => {
    //       localStorage.removeItem('savedExamData');
    //       router.push('/admin/tes-potensi-akademik');
    //     }, 2000);
    //   })
    //   .catch((error) => {
    //     setModalMessage('Terjadi kesalahan saat membuat ujian.');
    //     console.error('Error creating exam:', error);
    //   })
    //   .finally(() => {
    //     setTimeout(() => {
    //       setIsModalVisible(false);
    //     }, 2000);
    //   });
  };

  const handleSave = () => {
    const examData = {
      name: examName,
      deskripsi: examDescription,
      test_tpa_id: selectedTestTPA,
      categorized: tabs.map((tab) => ({
        score_lower_limit: tab.scoreLowerBound,
        score_upper_limit: tab.scoreUpperBound,
        soal: tab.questions.map((q) => ({
          soal: q.question,
          jawaban: q.options.map((opt) => ({
            jawaban: opt.answer,
            score: opt.score,
            penjelasan: opt.explanation,
          })),
        })),
      })),
    };

    localStorage.setItem('savedExamData', JSON.stringify(examData));
    alert('Data ujian telah disimpan!');
  };

  const handleScoreLowerBoundChange = (value) => {
    const newTabs = [...tabs];
    newTabs[activeTab].scoreLowerBound = value;
    setTabs(newTabs);
  };

  const handleScoreUpperBoundChange = (value) => {
    const newTabs = [...tabs];
    newTabs[activeTab].scoreUpperBound = value;
    setTabs(newTabs);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Modal message={modalMessage} isVisible={isModalVisible} />
      <DosenSidebar />
      <main className="flex-1 p-6 text-black">
        <div className="bg-white shadow-md rounded p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Membuat Ujian Mata Kuliah yang baru</h2>
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
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2">Test TPA</label>
            <select
              value={selectedTestTPA}
              onChange={(e) => setSelectedTestTPA(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">-- Pilih Test TPA --</option>
              {testTPA.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.name}
                </option>
              ))}
            </select>
          </div>
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            addTab={addTab}
            handleQuestionChange={handleQuestionChange}
            handleOptionChange={handleOptionChange}
            deleteQuestion={deleteQuestion}
            deleteOption={deleteOption}
            addQuestion={addQuestion}
            addOption={addOption}
            handleScoreLowerBoundChange={handleScoreLowerBoundChange}
            handleScoreUpperBoundChange={handleScoreUpperBoundChange}
          />
          <div className="flex justify-between mt-6">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white p-2 rounded"
            >
              Simpan
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Kirim
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
