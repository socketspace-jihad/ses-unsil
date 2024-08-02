"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "nookies";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

function useParams() {}

export default function Home(props) {
  const router = useRouter();
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [tpaData, setTpaData] = useState({ jawaban: [] });
  const [matkulData, setMatkulData] = useState({ jawaban: [] });
  const params = useSearchParams();

  useEffect(() => {
    params.forEach((val, key) => {
      console.log(val, key);
    });
    axios
      .get("/api/get-score-tpa", {
        params: {
          test_tpa_id: params.get("test_tpa_id"),
          mahasiswa_test_tpa_id: params.get("mahasiswa_test_tpa_id"),
        },
      })
      .then((resp) => {
        console.log(resp.data.jawaban);
        setTpaData(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("/api/get-score-matkul", {
        params: {
          test_matkul_categorized_id: params.get(
            "test_matkul_categorized_id"
          ),
          mahasiswa_test_matkul_id: params.get("mahasiswa_test_matkul_id"),
        },
      })
      .then((resp) => {
        console.log(resp.data.jawaban);
        setMatkulData(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleLogout = () => {
    setCookie(null, "auth-token", null, { path: "/" });
    router.push("/auth/login");
  };

  // Function to calculate the score for the Pie chart
  const calculateScoreData = (data) => {
    // Total number of unique questions
    const totalQuestions = new Set(data.jawaban.map((j) => j.soal_id)).size;

    // Calculate the number of correctly answered questions
    const correctlyAnswered = data.jawaban.filter(
      (j) => j.answered > 0 && j.score === 100
    ).length;

    const incorrectAnswersCount = totalQuestions - correctlyAnswered;

    return {
      labels: ["Benar", "Salah"],
      datasets: [
        {
          label: "Skor",
          data: [correctlyAnswered, incorrectAnswersCount],
          backgroundColor: ["#4CAF50", "#F44336"],
          hoverBackgroundColor: ["#66BB6A", "#EF5350"],
        },
      ],
    };
  };

  // Get unique questions by filtering unique soal_ids
  const uniqueQuestions = (data) =>
    Array.from(new Set(data.jawaban.map((item) => item.soal_id)));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4 text-lg font-bold">Smart Exam System</div>
        <nav className="mt-4">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="/dashboard">Dashboard</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="/profile">Profile</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <button onClick={handleLogout} className="w-full text-left">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <div className="container mx-auto p-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            Hasil Tes
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
                Ujian TPA
              </h2>
              <Pie data={calculateScoreData(tpaData)} />
              {tpaData.test && tpaData.maxScore && tpaData.jawaban ? (
                <>
                  <h4 className="text-black">
                    SCORE:{" "}
                    {(tpaData.test[0].score / tpaData.maxScore[0].max_score) *
                      100}
                  </h4>
                </>
              ) : (
                <></>
              )}
              <h3 className="text-lg font-medium mt-6 text-gray-600">
                Rekap Jawaban:
              </h3>
              <div className="flex flex-wrap mt-2">
                {uniqueQuestions(tpaData).map((soalId, index) => {
                  // Determine if any answer is selected for this question
                  const selectedAnswers = tpaData.jawaban.filter(
                    (j) => j.soal_id === soalId && j.answered > 0
                  );

                  // Determine button color
                  const buttonColor = selectedAnswers.length
                    ? selectedAnswers.some((a) => a.score === 100)
                      ? "bg-blue-500" // Correct answer selected
                      : "bg-red-500" // Incorrect answer selected
                    : "bg-gray-400"; // No answer selected

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedQuestionId(soalId);
                        setSelectedData(tpaData);
                      }}
                      className={`m-1 p-2 ${buttonColor} text-white rounded-md w-16 text-center`}
                    >
                      {`Soal ${soalId}`}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Ujian Mata Kuliah */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
                Ujian Mata Kuliah
              </h2>
              <Pie data={calculateScoreData(matkulData)} />
              {matkulData.test && matkulData.maxScore && matkulData.jawaban ? (
                <>
                  <h4 className="text-black">
                    SCORE:{" "}
                    {(matkulData.test[0].score /
                      matkulData.maxScore[0].max_score) *
                      100}
                  </h4>
                </>
              ) : (
                <></>
              )}
              <h3 className="text-lg font-medium mt-6 text-gray-600">
                Rekap Jawaban:
              </h3>
              <div className="flex flex-wrap mt-2">
                {uniqueQuestions(matkulData).map((soalId, index) => {
                  // Determine if any answer is selected for this question
                  const selectedAnswers = matkulData.jawaban.filter(
                    (j) => j.soal_id === soalId && j.answered > 0
                  );

                  // Determine button color
                  const buttonColor = selectedAnswers.length
                    ? selectedAnswers.some((a) => a.score === 100)
                      ? "bg-blue-500" // Correct answer selected
                      : "bg-red-500" // Incorrect answer selected
                    : "bg-gray-400"; // No answer selected

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedQuestionId(soalId);
                        setSelectedData(matkulData);
                      }}
                      className={`m-1 p-2 ${buttonColor} text-white rounded-md w-16 text-center`}
                    >
                      {`Soal ${soalId}`}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* End of Ujian Mata Kuliah */}
          </div>
        </div>
      </main>

      {selectedQuestionId && selectedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex text-black items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            {selectedData.jawaban
              .filter((j) => j.soal_id === selectedQuestionId)
              .slice(0, 1)
              .map((soal, index) => (
                <h2
                  key={index}
                  className="text-2xl font-semibold mb-4"
                >{`Soal: ${soal.soal}`}</h2>
              ))}
            <ul className="space-y-2">
              {selectedData.jawaban
                .filter((j) => j.soal_id === selectedQuestionId)
                .map((opsi, index) => (
                  <li
                    key={index}
                    className={`p-2 border ${
                      opsi.answered > 0 ? "bg-blue-200" : "bg-white"
                    } rounded-md`}
                  >
                    <div className="flex justify-between">
                      <span>{opsi.jawaban}</span>
                      <span>{opsi.score === 100 ? "✔️" : "❌"}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {opsi.penjelasan || ""}
                    </div>
                  </li>
                ))}
            </ul>
            <button
              onClick={() => setSelectedQuestionId(null)}
              className="mt-6 px-4 py-2 bg-gray-700 text-white rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
