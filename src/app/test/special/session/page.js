"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import SoundWave from './soundwave';

const Session = () => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useSearchParams();

  useEffect(() => {
    axios.get("/api/test-tpa", {
      params: {
        "test_tpa_id": params.get("test_tpa_id")
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
        
        // Reset answers when questions are fetched
        setAnswers(new Array(fetchedQuestions.length).fill(null));
        setCurrentQuestion(0); // Start at the first question
      })
      .catch(err => {
        if (err.response.status === 401) {
          router.push("/auth/login");
        }
      });
  }, [params.get("test_tpa_id"), router]);

  const handleAnswer = (index) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);

    // Check if all questions are answered
    const allAnswered = newAnswers.every(answer => answer !== null);
    if (allAnswered) {
      handleSubmit(allAnswered,newAnswers);
    } else {
      // Move to next question if not all questions are answered
      handleNextQuestion(allAnswered,newAnswers);
    }
  };

  const handleNextQuestion = (allAnswered,newAnswers) => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      handleSubmit(allAnswered,newAnswers);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = (allAnswer,answer) => {
    console.log("NEW ANSWER",answer);
    const unanswered = questions
      .map((_, index) => (answer[index] === null ? index : null))
      .filter(index => index !== null);
    if(allAnswer){
        const submittedAnswers = questions.reduce((acc, question, index) => {
        const selectedOption = question.options[answer[index]];
        if (selectedOption) {
            acc.push([parseInt(params.get("mahasiswa_test_tpa_id")), question.id, selectedOption.id]);
        }
        return acc;
        }, []);
        setShowModal(true);
        axios.post("/api/submit-ujian-tpa", {
            "answers": submittedAnswers,
            "mahasiswa_test_tpa_id": parseInt(params.get("mahasiswa_test_tpa_id"))
        })
        .then(resp => {
            if (typeof window !== 'undefined') {
            window.localStorage.removeItem('answers');
            }
            setLoading(false);
            setShowModal(false);
            router.push(`/test/special/finish?test_matkul_id=${params.get("test_matkul_id")}&test_tpa_id=${params.get("test_tpa_id")}&mahasiswa_test_tpa_id=${params.get("mahasiswa_test_tpa_id")}&kelas=${params.get("kelas")}`);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            setShowModal(false);
        });
    }
    if (unanswered.length > 0) {
      // Move to the first unanswered question
      setCurrentQuestion(unanswered[0]);
    } else {
      // Ujian sudah selesai, mengirimkan data...
      console.log("DONE");
    }
  };

  const cancelSubmit = () => {
    setShowModal(false);
  };

  const goToUnansweredQuestion = (index) => {
    setCurrentQuestion(index);
    setShowModal(false);
  };

  const getStatusColor = (index) => {
    if (index === currentQuestion) return 'bg-orange-500'; // Current question
    if (answers[index] !== null) return 'bg-green-500'; // Answered question
    return 'bg-gray-500'; // Unanswered question
  };

  const handleFinish = (optionIndex) => {
    handleAnswer(optionIndex);
  };

  return (
    <div className="relative">
      {/* Status Buttons */}
      <div className="flex justify-center mb-4 p-5 bg-grey">
        {questions.map((_, index) => (
          <button
            key={index}
            className={`w-8 h-8 rounded-full mx-1 ${getStatusColor(index)} text-white flex items-center justify-center`}
            onClick={() => setCurrentQuestion(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {questions.length > 0 && (
        <SoundWave
          key={currentQuestion} // Ensure re-render on question change
          text={questions[currentQuestion]?.question || ''}
          options={questions[currentQuestion]?.options || []}
          onFinish={handleFinish}
          setStatus={setLoading}
        />
      )}

      <div className="flex flex-col items-center justify-center mt-4">
        <div className="flex justify-between w-full max-w-3xl px-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleNextQuestion}
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-lg font-bold">Semua soal telah terjawab, ujian telah selesai</h2>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={() => {}}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Session;
