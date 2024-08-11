
import { initializeDatabase } from '../../../src/dbconfig.js';
import { authMiddleware } from "../../../middleware/auth";

async function handler(req, res) {
    // Handle different HTTP methods
    if (req.method === 'GET') {
        const conn = await initializeDatabase()
        try {
            console.log("USER ID",req.user.id);
            const [rows] =  await conn.execute(`
                SELECT
                    mtt.score AS score,
                    tt.name
                FROM test_tpa AS tt
                LEFT JOIN mahasiswa_test_tpa AS mtt
                    ON tt.id = mtt.test_tpa_id AND mtt.mahasiswa_id = ?
                ORDER BY tt.id
                LIMIT 10
            `,[req.user.id]);
            return res.status(200).json({rows})
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