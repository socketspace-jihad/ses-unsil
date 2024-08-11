import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../../middleware/auth"

async function handler(req,res){
    if (req.method === 'GET') {
        try {
            const conn = await initializeDatabase()
            const [rows] =  await conn.execute(`
                SELECT 
                    tt.id,
                    tt.name,
                    tt.created_at,
                    tt.start_date,
                    tt.due_date,
                    tt.deskripsi
                FROM 
                    test_tpa AS tt
                WHERE tt.dosen_id = ?
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