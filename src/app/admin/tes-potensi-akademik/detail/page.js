"use client";
import { useSearchParams } from "next/navigation";
import DosenSidebar from "../../../../../components/dosen/sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Page() {
    const [testTPA,setTestTPA] = useState({});
    const [testData, setTestData] = useState({});
    const [editing, setEditing] = useState(null);
    const [editedValue, setEditedValue] = useState({ soal: '', jawaban: '', score: '' });
    const [testDetails, setTestDetails] = useState({ name: '', created_at: '', start_date: '', due_date: '', deskripsi: '' });
    const [editingTestDetails, setEditingTestDetails] = useState(false);
    const params = useSearchParams();

    useEffect(() => {
        // Fetch test details
        const fetchTestDetails = async () => {
            const testId = params.get("id");
            try {
                const response = await axios.get(`/api/dosen/test-tpa-detail`, {
                    params: { "test_tpa_id": testId }
                });

                let temp = {};
                for (var soal of response.data.rows) {
                    if (temp.hasOwnProperty(soal["id"])) {
                        temp[soal["id"]]["jawaban"].push({
                            "jawaban": soal["jawaban"],
                            "id": soal["jawaban_id"],
                            "score": soal["score"]
                        });
                    } else {
                        temp[soal["id"]] = {
                            "id": soal["id"],
                            "soal": soal["soal"],
                            "jawaban": [{
                                "jawaban": soal["jawaban"],
                                "id": soal["jawaban_id"],
                                "score": soal["score"]
                            }]
                        };
                    }
                }
                setTestData(temp);
            } catch (err) {
                console.log(err);
            }
        };

        fetchTestDetails();

        axios.get("/api/dosen/test-tpa-by-id",{
            params:{
                "test_tpa_id":params.get("id")
            }
        })
        .then(resp=>{
            setTestDetails(resp.data.rows[0])
        })
        .catch(err=>{
            console.log(err)
        })
    }, [params]);

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID'; // Indonesian language
        utterance.rate = 0.65; // Speed of speech
        window.speechSynthesis.speak(utterance);
    };

    const handleEdit = (id, type, jawabanId = null) => {
        setEditing({ id, type, jawabanId });
        if (type === 'soal') {
            setEditedValue({ soal: testData[id].soal, jawaban: '', score: '' });
        } else {
            const jawaban = testData[id].jawaban.find(j => j.id === jawabanId);
            if (jawaban) {
                setEditedValue({ soal: '', jawaban: jawaban.jawaban, score: jawaban.score });
            }
        }
    };

    const handleSave = (id, type) => {
        if (type === 'soal') {
            axios.put("/api/dosen/edit-soal-tpa",{
                "id":id,
                "soal":editedValue.soal,
            })
            .then(resp=>{
                console.log("OK")
            })
            .catch(err=>{
                console.log(err)
            })
            setTestData(prev => ({
                ...prev,
                [id]: { ...prev[id], soal: editedValue.soal }
            }));
        } else {
            axios.put("/api/dosen/edit-jawaban-tpa",{
                "id":editing.jawabanId,
                "jawaban":editedValue.jawaban,
                "score":editedValue.score
            })
            .then(resp=>{
                console.log("OK")
            })
            .catch(err=>{
                console.log(err)
            })
            setTestData(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    jawaban: prev[id].jawaban.map(j => 
                        j.id === editing.jawabanId ? { ...j, jawaban: editedValue.jawaban, score: editedValue.score } : j
                    )
                }
            }));
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

        axios.put("/api/dosen/edit-test-tpa", {
            name,
            deskripsi,
            "id":params.get("id")
        })
        .then(resp => {
            console.log("Metadata updated successfully");
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
                            <button
                                onClick={handleEditTestDetail}
                                className="mt-4 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                        </>
                    )}
                </div>
                {Object.keys(testData).map(key => (
                    <div key={key} className="mb-4 p-4 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold text-teal-600">
                                {editing && editing.type === 'soal' && editing.id === key ? (
                                    <>
                                        <input
                                            type="text"
                                            name="soal"
                                            value={editedValue.soal}
                                            onChange={handleChange}
                                            className="border border-gray-300 p-1 rounded"
                                        />
                                        <button
                                            onClick={() => handleSave(key, 'soal')}
                                            className="ml-2 bg-teal-500 text-white px-3 py-1 rounded-lg hover:bg-teal-600"
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {testData[key].soal}
                                        <button
                                            onClick={() => handleEdit(key, 'soal')}
                                            className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                    </>
                                )}
                            </h2>
                            <button
                                onClick={() => speakText(testData[key].soal)}
                                className="ml-2 bg-teal-500 text-white px-3 py-1 rounded-lg hover:bg-teal-600"
                            >
                                <i className="fa fa-volume-up">Speak</i>
                            </button>
                        </div>
                        <div className="space-y-2">
                            {testData[key].jawaban.map((jawaban) => (
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
                                                    onClick={() => handleSave(key, 'jawaban')}
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
                                                    onClick={() => handleEdit(key, 'jawaban', jawaban.id)}
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
                ))}
            </div>
        </div>
    );
}
