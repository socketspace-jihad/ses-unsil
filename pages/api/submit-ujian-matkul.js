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
                    mahasiswa_test_matkul_jawaban
                (
                    mahasiswa_test_matkul_id,
                    test_matkul_soal_id,
                    test_matkul_jawaban_id
                ) VALUES ?
            `,[jawaban]);


            const [rows2] =  await conn.query(`
                UPDATE mahasiswa_test_matkul AS mtm
                INNER JOIN (
                    SELECT
                        mtmj.mahasiswa_test_matkul_id AS id,
                        SUM(tmj.score) AS total
                    FROM
                        mahasiswa_test_matkul_jawaban AS mtmj
                    LEFT JOIN test_matkul_jawaban AS tmj
                        ON mtmj.test_matkul_jawaban_id = tmj.id
                    WHERE mtmj.mahasiswa_test_matkul_id = ?
                    GROUP BY mtmj.mahasiswa_test_matkul_id
                ) AS scores
                ON mtm.id = scores.id
                SET
                    mtm.status_pengerjaan = 1,
                    mtm.score = scores.total
                WHERE mtm.id = ?;
            `,[req.body.mahasiswa_test_matkul_id,req.body.mahasiswa_test_matkul_id]);
            console.log("DONE")
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