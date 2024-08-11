
import { initializeDatabase } from '../../../src/dbconfig.js';
import { authMiddleware } from "../../../middleware/auth";

async function handler(req, res) {
    // Handle different HTTP methods
    if (req.method === 'GET') {
        const conn = await initializeDatabase()
        try {
            const [rows] =  await conn.execute(`
                SELECT
                    mtm.score AS score,
                    tm.name
                FROM test_matkul AS tm
                LEFT JOIN mahasiswa_test_matkul AS mtm
                    ON tm.id = mtm.test_matkul_id AND mtm.mahasiswa_id = ?
                ORDER BY tm.id
                LIMIT 10
            `,[req.user.id]);
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