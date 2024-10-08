import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../middleware/auth"

async function handler(req,res){
    if (req.method === 'POST') {
        try {
            const jawaban = req.body.answers;
            const conn = await initializeDatabase()
            await conn.beginTransaction();
            const [rows] =  await conn.query(`
                INSERT INTO
                    mahasiswa_test_tpa_jawaban
                (
                    mahasiswa_test_tpa_id,
                    test_tpa_soal_id,
                    test_tpa_jawaban_id
                ) VALUES ?
            `,[jawaban]);


            const [rows2] =  await conn.query(`
                UPDATE mahasiswa_test_tpa AS mtt
                INNER JOIN (
                    SELECT
                        mttj.mahasiswa_test_tpa_id AS id,
                        SUM(ttj.score) AS total
                    FROM
                        mahasiswa_test_tpa_jawaban AS mttj
                    LEFT JOIN test_tpa_jawaban AS ttj
                        ON mttj.test_tpa_jawaban_id = ttj.id
                    WHERE mttj.mahasiswa_test_tpa_id = ?
                    GROUP BY mttj.mahasiswa_test_tpa_id
                ) AS scores
                ON mtt.id = scores.id
                SET
                    mtt.status_pengerjaan = 1,
                    mtt.score = scores.total
                WHERE mtt.id = ?;
            `,[req.body.mahasiswa_test_tpa_id,req.body.mahasiswa_test_tpa_id]);
            await conn.commit();
            return res.status(200).json({rows})
        } catch(error){
            console.log(error)
            conn.release();
            return res.status(500).json({})
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default authMiddleware(handler)