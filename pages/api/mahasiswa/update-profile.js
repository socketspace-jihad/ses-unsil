
import { initializeDatabase } from '../../../src/dbconfig.js';
import { authMiddleware } from "../../../middleware/auth";

async function handler(req, res) {
    // Handle different HTTP methods
    if (req.method === 'PUT') {
        const conn = await initializeDatabase()
        try {
            const {name,contact,angkatan} = req.body;
            const [rows] =  await conn.execute(`
                UPDATE mahasiswa
                SET
                    name = ?,
                    contact = ?,
                    angkatan = ?
                WHERE id=?
            `,[name,contact,angkatan,req.user.id]);
            return res.status(200).json(req.body);
        } catch(error){
            console.log(error);
            conn.release();
            return res.status(500).json({})
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default authMiddleware(handler)