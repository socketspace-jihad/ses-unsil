import React from 'react';

function TabBar({
  tabs,
  activeTab,
  handleTabClick,
  addTab,
  handleQuestionChange,
  handleOptionChange,
  deleteQuestion,
  deleteOption,
  addQuestion,
  addOption, // Prop ini harus ada
  handleScoreLowerBoundChange,
  handleScoreUpperBoundChange
}) {
  return (
    <div>
      <div className="flex mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`flex-1 py-2 px-4 text-left ${
              activeTab === index ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Tab {index + 1}
          </button>
        ))}
        <button
          onClick={addTab}
          className="ml-2 bg-green-500 text-white py-2 px-4 rounded"
        >
          Tambah Tab
        </button>
      </div>

      {tabs.length > 0 && (
        <div>
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2">Batas Skor Bawah</label>
            <input
              type="number"
              value={tabs[activeTab].scoreLowerBound}
              onChange={(e) => handleScoreLowerBoundChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Masukkan batas skor bawah"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2">Batas Skor Atas</label>
            <input
              type="number"
              value={tabs[activeTab].scoreUpperBound}
              onChange={(e) => handleScoreUpperBoundChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Masukkan batas skor atas"
            />
          </div>

          <div className="space-y-4">
            {tabs[activeTab].questions.map((question, qIndex) => (
              <div key={qIndex} className="bg-gray-100 p-4 rounded shadow">
                <div className="mb-4">
                  <label className="block text-gray-600 font-semibold mb-2">Soal {qIndex + 1}</label>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Masukkan soal"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option.answer}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'answer', e.target.value)}
                        className="w-1/2 p-2 border border-gray-300 rounded"
                        placeholder="Jawaban"
                      />
                      <input
                        type="number"
                        value={option.score}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'score', e.target.value)}
                        className="ml-2 w-1/4 p-2 border border-gray-300 rounded"
                        placeholder="Skor"
                      />
                      <input
                        type="text"
                        value={option.explanation}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'explanation', e.target.value)}
                        className="ml-2 w-1/2 p-2 border border-gray-300 rounded"
                        placeholder="Penjelasan"
                      />
                      <button
                        onClick={() => deleteOption(qIndex, oIndex)}
                        className="ml-2 bg-red-500 text-white p-1 rounded"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(qIndex)} // Ensure this is being used correctly
                    className="bg-blue-500 text-white py-1 px-4 rounded"
                  >
                    Tambah Opsi
                  </button>
                </div>
                <button
                  onClick={() => deleteQuestion(qIndex)}
                  className="bg-red-500 text-white py-1 px-4 rounded"
                >
                  Hapus Soal
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addQuestion}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Tambah Soal
          </button>
        </div>
      )}
    </div>
  );
}

export default TabBar;
