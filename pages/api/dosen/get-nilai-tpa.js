
import { initializeDatabase } from '../../../src/dbconfig.js';
import { authMiddleware } from "../../../middleware/auth";

async function handler(req, res) {
    // Handle different HTTP methods
    if (req.method === 'GET') {
        const conn = await initializeDatabase()
        try {
            const [rows] =  await conn.execute(`
                SELECT
                    tt.name,
                    tt.created_at,
                    AVG(mtt.score) AS score
                FROM mahasiswa_test_tpa AS mtt
                RIGHT JOIN test_tpa AS tt
                    ON tt.id = mtt.test_tpa_id
                WHERE tt.dosen_id=?
                GROUP BY tt.id
                ORDER BY tt.id
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