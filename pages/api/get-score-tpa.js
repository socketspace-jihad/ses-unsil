
import { initializeDatabase } from '../../src/dbconfig.js';
import { authMiddleware } from "../../middleware/auth.js";

async function handler(req, res) {
    // Handle different HTTP methods
    if (req.method === 'GET') {
        try {
            const {test_tpa_id} = req.query;
            const conn = await initializeDatabase({
                multipleStatements: true
            })
            const [test] =  await conn.execute(`
                SELECT
                    *
                FROM mahasiswa_test_tpa AS mtt
                WHERE
                    mtt.test_tpa_id = ? AND mtt.mahasiswa_id = ?;
            `,[test_tpa_id,req.user.id]);
            const [maxScore] = await conn.execute(`
                SELECT
                    SUM(score) AS max_score
                FROM test_tpa_jawaban AS ttj
                LEFT JOIN test_tpa_soal AS tts
                    ON tts.id = ttj.test_tpa_soal_id
                LEFT JOIN test_tpa AS tt
                    ON tt.id = tts.test_tpa_id
                WHERE tt.id = ?
                GROUP BY tt.id;    
            `,[test_tpa_id])
            const [jawaban] = await conn.execute(`
                SELECT
                    tts.id AS soal_id,
                    tts.soal,
                    ttj.jawaban,
                    ttj.penjelasan,
                    ttj.score,
                    IFNULL(mttj.test_tpa_jawaban_id,0) AS answered
                FROM test_tpa_jawaban AS ttj
                LEFT JOIN test_tpa_soal AS tts
                    ON tts.id = ttj.test_tpa_soal_id
                LEFT JOIN test_tpa AS tt
                    ON tt.id = tts.test_tpa_id
                LEFT JOIN mahasiswa_test_tpa_jawaban AS mttj
                    ON mttj.test_tpa_jawaban_id = ttj.id
                WHERE tt.id = ?
                GROUP BY ttj.id;
            `,[test_tpa_id])
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