
import { initializeDatabase } from '../../src/dbconfig.js';
import { authMiddleware } from "../../middleware/auth";

async function handler(req, res) {
    // Handle different HTTP methods
    if (req.method === 'GET') {
        try {
            console.log(req.query);
            const {test_tpa_id} = req.query;
            const conn = await initializeDatabase()
            const [rows] =  await conn.execute(`
                SELECT
                    *
                FROM mahasiswa_test_tpa AS mtt
                WHERE
                    mtt.test_tpa_id = ? AND mtt.mahasiswa_id = ?
            `,[test_tpa_id,req.user.id]);
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