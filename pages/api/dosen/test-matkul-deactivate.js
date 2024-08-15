import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../../middleware/auth"

async function handler(req,res){
    if (req.method === 'POST') {
        try {
            const {ids} = req.body;
            const conn = await initializeDatabase()
            for(var id of ids){
                const [rows] =  await conn.execute(`
                    UPDATE test_matkul
                    SET published = 0
                    WHERE id = ? AND dosen_id = ?
                `,[id,req.user.id]);
            } 
            return res.status(200).json({ids})
        } catch(error){
            console.log(error)
            return res.status(500).json({})
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default authMiddleware(handler)