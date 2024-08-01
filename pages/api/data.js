
import { initializeDatabase } from '../../src/dbconfig.js';
import { authMiddleware } from "../../middleware/auth";

async function handler(req, res) {
    // Handle different HTTP methods
    if (req.method === 'GET') {
        try {
            const conn = await initializeDatabase()
            const [rows] =  await conn.execute(`
                SELECT 
                    tm.id,
                    tm.name,
                    tm.created_at,
                    tm.start_date,
                    tm.due_date,
                    tm.need_test_tpa,
                    IFNULL(tm.test_tpa_id,0) AS test_tpa_id,
                    tm.deskripsi,
                    m.name AS matkul_name,
                    IFNULL(test_count.counter,0) AS counter,
                    test_count.status_pengerjaan,
                    test_count.test_matkul_categorized_id,
                    test_count.id AS mahasiswa_test_matkul_id,
                    IFNULL(test_count_tpa.counter,0) AS counter_tpa,
                    test_count_tpa.status_pengerjaan AS status_pengerjaan_tpa
                FROM 
                test_matkul AS tm
                LEFT JOIN matkul AS m
                    ON m.id = tm.matkul_id
                LEFT JOIN (
                    SELECT COUNT(id) AS counter, test_matkul_id,status_pengerjaan,test_matkul_categorized_id,id,score
                    FROM mahasiswa_test_matkul
                    WHERE mahasiswa_id = ?
                    GROUP BY test_matkul_id
                ) AS test_count
                 ON test_count.test_matkul_id = tm.id
                LEFT JOIN (
                    SELECT COUNT(id) AS counter, test_tpa_id,status_pengerjaan,id,score
                    FROM mahasiswa_test_tpa
                    WHERE mahasiswa_id = ?
                    GROUP BY test_tpa_id
                ) AS test_count_tpa
                 ON test_count_tpa.test_tpa_id = tm.test_tpa_id

            `,[req.user.id,req.user.id]);
            return res.status(200).json({rows})
        } catch(error){
            console.log(error)
            return res.status(500).json({})
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default authMiddleware(handler)