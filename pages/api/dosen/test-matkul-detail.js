import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../../middleware/auth"

async function handler(req,res){
    if (req.method === 'GET') {
        try {
            const { test_matkul_id } = req.query;
            const conn = await initializeDatabase()
            const [rows] =  await conn.execute(`
                SELECT 
                    tmc.id AS categorized_id,
                    tmc.tpa_score_lower_limit,
                    tmc.tpa_score_upper_limit,
                    tms.id,
                    tms.soal,
                    tmj.id AS jawaban_id,
                    tmj.jawaban,
                    tmj.score,
                    tmj.penjelasan
                FROM 
                    test_matkul AS tm
                LEFT JOIN
                    test_matkul_categorized AS tmc
                ON tmc.test_matkul_id = tm.id
                LEFT JOIN
                    test_matkul_soal AS tms
                ON tms.test_matkul_categorized_id = tmc.id
                LEFT JOIN
                    test_matkul_jawaban AS tmj
                ON tmj.test_matkul_soal_id = tms.id
                WHERE tm.id = ? AND tm.dosen_id=?
            `,[test_matkul_id,req.user.id]);
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