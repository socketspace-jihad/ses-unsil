import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../middleware/auth"

async function handler(req,res){
    if (req.method === 'GET') {
        try {
            console.log(req.query);
            const { test_tpa_id } = req.query;
            console.log("TPA",test_tpa_id)
            const conn = await initializeDatabase()
            const [rows] =  await conn.execute(`
                SELECT
                    tms.id AS question_id,
                    tms.soal AS question,
                    tmj.id AS option_id,
                    tmj.jawaban AS 'option'
                FROM test_tpa_soal AS tms
                JOIN test_tpa_jawaban AS tmj
                    ON tmj.test_tpa_soal_id = tms.id
                WHERE tms.test_tpa_id = ?
            `,[test_tpa_id]);
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