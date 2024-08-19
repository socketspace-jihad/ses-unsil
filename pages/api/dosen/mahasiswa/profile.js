
import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../../../middleware/auth";

async function handler(req, res) {
    // Handle different HTTP methods
    if (req.method === 'GET') {
        const conn = await initializeDatabase()
        try {
            const {id} = req.query;
            const [rows] =  await conn.execute(`
                SELECT
                    name,
                    npm,
                    contact,
                    angkatan
                FROM mahasiswa
                WHERE id=?
            `,[id]);
            return res.status(200).json({rows})
        } catch(error){
            conn.release();
            return res.status(500).json({})
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default authMiddleware(handler)