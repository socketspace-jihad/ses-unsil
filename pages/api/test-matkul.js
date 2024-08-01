import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../middleware/auth"

async function handler(req,res){
    if (req.method === 'GET') {
        try {
            const { test_matkul_categorized_id } = req.query;
            const conn = await initializeDatabase()
            const [rows] =  await conn.execute(`
                SELECT
                    tms.id AS question_id,
                    tms.soal AS question,
                    tmj.id AS option_id,
                    tmj.jawaban AS 'option'
                FROM test_matkul_soal AS tms
                JOIN test_matkul_jawaban AS tmj
                    ON tmj.test_matkul_soal_id = tms.id
                WHERE tms.test_matkul_categorized_id = ?
            `,[test_matkul_categorized_id]);
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