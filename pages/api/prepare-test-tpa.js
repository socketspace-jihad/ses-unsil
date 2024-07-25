import { initializeDatabase } from '../../src/dbconfig.js';
import { authMiddleware } from "../../middleware/auth";

async function handler(req, res) {
    // Handle different HTTP methods
    if (req.method === 'POST') {
        try {
            const {test_tpa_id,kelas} = req.body;
            const conn = await initializeDatabase()
            const [rows] =  await conn.execute(`
                INSERT INTO
                    mahasiswa_test_tpa
                (
                    test_tpa_id,
                    mahasiswa_id,
                    status_pengerjaan,
                    kelas    
                ) VALUES (?,?,0,?)
            `,[test_tpa_id,req.user.id,kelas]);
            console.log(rows);
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