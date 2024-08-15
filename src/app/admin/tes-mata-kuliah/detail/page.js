"use client";
import { useSearchParams } from "next/navigation";
import DosenSidebar from "../../../../../components/dosen/sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import TabBar from "./tabbar";

const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};



export default function Page() {
    const [testData, setTestData] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editing, setEditing] = useState(null);
    const [editedValue, setEditedValue] = useState({ soal: '', jawaban: '', score: '' });
    const [testDetails, setTestDetails] = useState({ name: '', created_at: '', start_date: '', due_date: '', deskripsi: '', test_tpa_name: '' });
    const [editingTestDetails, setEditingTestDetails] = useState(false);
    const params = useSearchParams();

    useEffect(() => {
        const fetchTestDetails = async () => {
            const testId = params.get("id");
            try {
                const response = await axios.get('/api/dosen/test-matkul-detail', {
                    params: { "test_matkul_id": testId }
                });

                let temp = {};
                for (const categorized of response.data.rows) {
                    if (!temp[categorized["categorized_id"]]) {
                        temp[categorized["categorized_id"]] = {
                            id: categorized["categorized_id"],
                            tpa_score_lower_limit: categorized["tpa_score_lower_limit"],
                            tpa_score_upper_limit: categorized["tpa_score_upper_limit"],
                        };
                    }
                    if (!temp[categorized["categorized_id"]][categorized["id"]]) {
                        temp[categorized["categorized_id"]][categorized["id"]] = {
                            id: categorized["id"],
                            soal: categorized["soal"],
                            jawaban: []
                        };
                    }
                    temp[categorized["categorized_id"]][categorized["id"]].jawaban.push({
                        jawaban: categorized["jawaban"],
                        id: categorized["jawaban_id"],
                        score: categorized["score"]
                    });
                }
                setTestData(temp);
                const defaultCategory = Object.keys(temp)[0] || null;
                setSelectedCategory(defaultCategory);
            } catch (err) {
                console.log(err);
            }
        };

        fetchTestDetails();

        axios.get('/api/dosen/test-matkul-by-id', {
            params: { "test_matkul_id": params.get("id") }
        })
        .then(resp => {
            setTestDetails(resp.data.rows[0]);
        })
        .catch(err => {
            console.log(err);
        });
    }, [params]);

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.65;
        window.speechSynthesis.speak(utterance);
    };

    const handleEdit = (id, type, jawabanId = null) => {
        setEditing({ id, type, jawabanId });
        if (type === 'soal') {
            setEditedValue({ soal: testData[selectedCategory]?.[id]?.soal || '', jawaban: '', score: '' });
        } else {
            const jawaban = testData[selectedCategory]?.[id]?.jawaban.find(j => j.id === jawabanId);
            if (jawaban) {
                setEditedValue({ soal: '', jawaban: jawaban.jawaban, score: jawaban.score });
            }
        }
    };

    const handleSave = (id, type) => {
        if (type === 'soal') {
            axios.put('/api/dosen/edit-soal-matkul', {
                id,
                soal: editedValue.soal
            })
            .then(() => {
                setTestData(prev => ({
                    ...prev,
                    [selectedCategory]: {
                        ...prev[selectedCategory],
                        [id]: { ...prev[selectedCategory][id], soal: editedValue.soal }
                    }
                }));
            })
            .catch(err => {
                console.log(err);
            });
        } else {
            axios.put('/api/dosen/edit-jawaban-matkul', {
                id: editing.jawabanId,
                jawaban: editedValue.jawaban,
                score: editedValue.score
            })
            .then(() => {
                setTestData(prev => ({
                    ...prev,
                    [selectedCategory]: {
                        ...prev[selectedCategory],
                        [id]: {
                            ...prev[selectedCategory][id],
                            jawaban: prev[selectedCategory][id].jawaban.map(j =>
                                j.id === editing.jawabanId ? { ...j, jawaban: editedValue.jawaban, score: editedValue.score } : j
                            )
                        }
                    }
                }));
            })
            .catch(err => {
                console.log(err);
            });
        }
        setEditing(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedValue(prev => ({ ...prev, [name]: value }));
    };

    const handleEditTestDetail = () => {
        setEditingTestDetails(true);
    };

    const handleSaveTestDetail = () => {
        const { name, created_at, start_date, due_date, deskripsi } = testDetails;
        const formattedStartDate = formatDate(start_date);
        const formattedDueDate = formatDate(due_date);
        axios.put('/api/dosen/edit-test-matkul', {
            name,
            deskripsi,
            start_date: formattedStartDate,
            due_date: formattedDueDate,
            id: params.get("id")
        })
        .then(resp => {
            console.log(resp);
            setEditingTestDetails(false);
        })
        .catch(err => {
            console.log(err);
        });
    };

    const handleTestDetailChange = (e) => {
        const { name, value } = e.target;
        setTestDetails(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex bg-gray-100 h-screen text-black">
            <DosenSidebar />
            <div className="p-3 w-full" id="content">
                <div className="m-4" id="test-tpa-detail">
                    <h1 className="text-2xl font-bold text-teal-600">Test Details</h1>
                    {editingTestDetails ? (
                        <>
                            <input
                                type="text"
                                name="name"
                                value={testDetails.name}
                                onChange={handleTestDetailChange}
                                className="border border-gray-300 p-1 rounded"
                                placeholder="Test Name"
                            />
                            <textarea
                                name="deskripsi"
                                value={testDetails.deskripsi}
                                onChange={handleTestDetailChange}
                                className="border border-gray-300 p-1 rounded mt-2"
                                placeholder="Description"
                            />
                            <input
                                type="datetime-local"
                                name="start_date"
                                value={new Date(testDetails.start_date).toISOString().slice(0, -1)}
                                onChange={handleTestDetailChange}
                                className="border border-gray-300 p-1 rounded mt-2"
                            />
                            <input
                                type="datetime-local"
                                name="due_date"
                                value={new Date(testDetails.due_date).toISOString().slice(0, -1)}
                                onChange={handleTestDetailChange}
                                className="border border-gray-300 p-1 rounded mt-2"
                            />
                            <button
                                onClick={handleSaveTestDetail}
                                className="mt-4 bg-teal-500 text-white px-3 py-1 rounded-lg hover:bg-teal-600"
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="mt-2"><strong>Name:</strong> {testDetails.name}</p>
                            <p className="mt-2"><strong>Description:</strong> {testDetails.deskripsi}</p>
                            <p className="mt-2"><strong>Test TPA Name:</strong> {testDetails.test_tpa_name}</p>
                            <p className="mt-2"><strong>Start Date:</strong> {new Date(testDetails.start_date).toLocaleString()}</p>
                            <p className="mt-2"><strong>Due Date:</strong> {new Date(testDetails.due_date).toLocaleString()}</p>
                            <button
                                onClick={handleEditTestDetail}
                                className="mt-4 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                        </>
                    )}
                </div>
                <TabBar categories={testData} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                {selectedCategory && (
                    <div className="mt-4">
                        {Object.keys(testData[selectedCategory] || {}).map(soalId => {
                            const soal = testData[selectedCategory][soalId];
                            if (soal.id) {
                                return (
                                    <div key={soalId} className="mb-4 p-4 bg-white shadow-lg rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <h2 className="text-lg font-bold text-teal-600">
                                                {editing && editing.type === 'soal' && editing.id === soalId ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            name="soal"
                                                            value={editedValue.soal}
                                                            onChange={handleChange}
                                                            className="border border-gray-300 p-1 rounded"
                                                        />
                                                        <button
                                                            onClick={() => handleSave(soalId, 'soal')}
                                                            className="ml-2 bg-teal-500 text-white px-3 py-1 rounded-lg hover:bg-teal-600"
                                                        >
                                                            Save
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {soal.soal}
                                                        <button
                                                            onClick={() => handleEdit(soalId, 'soal')}
                                                            className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                                                        >
                                                            Edit
                                                        </button>
                                                    </>
                                                )}
                                            </h2>
                                            <button
                                                onClick={() => speakText(soal.soal)}
                                                className="ml-2 bg-teal-500 text-white px-3 py-1 rounded-lg hover:bg-teal-600"
                                            >
                                                <i className="fa fa-volume-up">Speak</i>
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {soal.jawaban.map((jawaban) => (
                                                <div key={jawaban.id} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg">
                                                    <div>
                                                        {editing && editing.type === 'jawaban' && editing.jawabanId === jawaban.id ? (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    name="jawaban"
                                                                    value={editedValue.jawaban}
                                                                    onChange={handleChange}
                                                                    className="border border-gray-300 p-1 rounded"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    name="score"
                                                                    value={editedValue.score}
                                                                    onChange={handleChange}
                                                                    className="border border-gray-300 p-1 rounded ml-2"
                                                                />
                                                                <button
                                                                    onClick={() => handleSave(soalId, 'jawaban')}
                                                                    className="ml-2 bg-teal-500 text-white px-3 py-1 rounded-lg hover:bg-teal-600"
                                                                >
                                                                    Save
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="text-sm text-gray-700">{jawaban.jawaban}</p>
                                                                <p className="text-xs text-gray-500">Score: {jawaban.score}</p>
                                                                <button
                                                                    onClick={() => handleEdit(soalId, 'jawaban', jawaban.id)}
                                                                    className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                                                                >
                                                                    Edit
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => speakText(jawaban.jawaban)}
                                                        className="ml-2 bg-teal-500 text-white px-3 py-1 rounded-lg hover:bg-teal-600"
                                                    >
                                                        <i className="fa fa-volume-up">Speak</i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
