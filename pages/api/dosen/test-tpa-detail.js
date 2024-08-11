import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../../middleware/auth"

async function handler(req,res){
    if (req.method === 'GET') {
        try {
            const { test_tpa_id } = req.query;
            const conn = await initializeDatabase()
            const [rows] =  await conn.execute(`
                SELECT 
                    tts.id,
                    tts.soal,
                    ttj.id AS jawaban_id,
                    ttj.jawaban,
                    ttj.score,
                    ttj.penjelasan
                FROM 
                    test_tpa AS tt
                LEFT JOIN
                    test_tpa_soal AS tts
                ON tts.test_tpa_id = tt.id
                LEFT JOIN
                    test_tpa_jawaban AS ttj
                ON ttj.test_tpa_soal_id = tts.id
                WHERE tt.id = ? AND tt.dosen_id=?
            `,[test_tpa_id,req.user.id]);
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