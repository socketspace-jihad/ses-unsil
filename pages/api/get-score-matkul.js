
import { initializeDatabase } from '../../src/dbconfig.js';
import { authMiddleware } from "../../middleware/auth.js";

async function handler(req, res) {
    // Handle different HTTP methods
    if (req.method === 'GET') {
        try {
            const {
                test_matkul_categorized_id,mahasiswa_test_matkul_id} = req.query;
            console.log("LOG",req.query);
            const conn = await initializeDatabase()
            const [test] =  await conn.execute(`
                SELECT
                    *
                FROM mahasiswa_test_matkul AS mtm
                WHERE
                    mtm.test_matkul_categorized_id = ? AND mtm.mahasiswa_id = ?;
            `,[test_matkul_categorized_id,req.user.id]);
            const [maxScore] = await conn.execute(`
                SELECT
                    SUM(score) AS max_score
                FROM test_matkul_jawaban AS tmj
                LEFT JOIN test_matkul_soal AS tms
                    ON tms.id = tmj.test_matkul_soal_id
                LEFT JOIN test_matkul_categorized AS tmc
                    ON tmc.id = tms.test_matkul_categorized_id
                WHERE tmc.id = ?
                GROUP BY tmc.id;    
            `,[test_matkul_categorized_id])
            const [jawaban] = await conn.execute(`
                SELECT
                    tms.id AS soal_id,
                    tms.soal,
                    tmj.jawaban,
                    tmj.penjelasan,
                    tmj.score,
                    IFNULL(mtmj.test_matkul_jawaban_id,0) AS answered
                FROM test_matkul_jawaban AS tmj
                LEFT JOIN test_matkul_soal AS tms
                    ON tms.id = tmj.test_matkul_soal_id
                LEFT JOIN test_matkul_categorized AS tmc
                    ON tmc.id = tms.test_matkul_categorized_id
                LEFT JOIN mahasiswa_test_matkul_jawaban AS mtmj
                    ON mtmj.test_matkul_jawaban_id = tmj.id AND mtmj.mahasiswa_test_matkul_id = ?
                WHERE tmc.id = ?
                GROUP BY tmj.id;
            `,[mahasiswa_test_matkul_id,test_matkul_categorized_id])
            return res.status(200).json({test,maxScore,jawaban})
        } catch(error){
            console.log(error)
            return res.status(500).json({})
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default authMiddleware(handler)