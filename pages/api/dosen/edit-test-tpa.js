import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../../middleware/auth"

async function handler(req,res){
    const conn = await initializeDatabase();
    if (req.method === 'PUT') {
        try {
            const data = req.body;
            await conn.beginTransaction();
            console.log(data);
            const [testTpa] = await conn.execute(`
                UPDATE test_tpa
                SET name = ?, deskripsi = ?
                WHERE id = ?
            `,[data.name,data.deskripsi,data.id])
            await conn.commit();
            return res.status(200).json({testTpa})
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