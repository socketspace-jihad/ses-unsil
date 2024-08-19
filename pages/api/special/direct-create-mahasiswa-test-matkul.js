import { initializeDatabase } from "@/dbconfig";
import { specialMiddleware } from "../../../middleware/special";

async function handler(req, res) {
    // Handle different HTTP methods
    if (req.method === 'POST') {
        const conn = await initializeDatabase()
        try {
            const data = req.body;
            console.log("DATA",data);
            const [testTPA] = await conn.execute(`
                SELECT
                    *
                FROM test_matkul_categorized
                WHERE test_matkul_id = ? AND tpa_score_lower_limit <= ? AND tpa_score_upper_limit >= ?
            `,[
                data.test_matkul_id,
                data.score,
                data.score
            ])
            if(testTPA.length == 0){
                return res.status(200).json({})
            }
            const [rows] =  await conn.execute(`
                INSERT INTO
                    mahasiswa_test_matkul
                (
                    test_matkul_id,
                    test_matkul_categorized_id,
                    mahasiswa_id,
                    nama_kelas,
                    status_pengerjaan
                ) VALUES (?,?,?,?,?)
            `,[
                data.test_matkul_id,
                testTPA[0].id,
                req.mahasiswa.id,
                data.nama_kelas,
                0
            ]);

            return res.status(200).json({
                "insertId":rows.insertId,
                "categorized_id":testTPA[0].id
            })
        } catch(error){
            console.log(error)
            conn.release();
            return res.status(500).json({})
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default specialMiddleware(handler)