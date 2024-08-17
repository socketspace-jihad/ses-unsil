import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../../middleware/auth"
import { specialMiddleware } from "../../../middleware/special";

async function handler(req,res){
    if (req.method === 'GET') {
        try {
            const { test_matkul_id } = req.query;
            const conn = await initializeDatabase()
            const [rows] =  await conn.execute(`
                SELECT 
                    tm.*,
                    tt.name AS test_tpa_name
                FROM 
                    test_matkul AS tm
                LEFT JOIN
                    test_tpa AS tt
                ON tt.id = tm.test_tpa_id
                WHERE tm.id = ? AND tm.dosen_id=?
            `,[test_matkul_id,req.dosen.id]);
            return res.status(200).json({rows})
        } catch(error){
            console.log(error)
            return res.status(500).json({})
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default specialMiddleware(handler)