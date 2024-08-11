import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../../middleware/auth"

async function handler(req,res){
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
                    m.name AS matkul_name
                FROM 
                test_matkul AS tm
                LEFT JOIN matkul AS m
                    ON m.id = tm.matkul_id
                WHERE tm.dosen_id = ?
            `,[req.user.id]);
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