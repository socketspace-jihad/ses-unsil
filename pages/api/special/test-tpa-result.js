import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../../middleware/auth"
import { specialMiddleware } from "../../../middleware/special";

async function handler(req,res){
    if (req.method === 'GET') {
        try {
            const { test_tpa_id,test_matkul_id } = req.query;
            const conn = await initializeDatabase()
            const [rows] =  await conn.execute(`
                SELECT 
                    mtt.*,
                    tt.name
                FROM 
                    mahasiswa_test_tpa AS mtt
                LEFT JOIN
                    test_tpa AS tt
                ON tt.id = mtt.test_tpa_id
                WHERE mtt.test_tpa_id = ? AND mtt.mahasiswa_id = ?
            `,[test_tpa_id,req.mahasiswa.id]);
            if(rows.length == 0){
                return res.status(200).json({rows})
            }
            const [testMatkulCategorized] = await conn.execute(`
                SELECT
                    *
                FROM test_matkul_categorized
                WHERE test_matkul_id = ? AND tpa_score_lower_limit <= ? AND tpa_score_upper_limit >= ?
            `,[test_matkul_id,rows[0].score,rows[0].score])
            return res.status(200).json({
                rows,
                categorized: testMatkulCategorized
            })
        } catch(error){
            console.log(error)
            return res.status(500).json({})
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default specialMiddleware(handler)