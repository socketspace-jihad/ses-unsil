import { initializeDatabase } from "@/dbconfig";
import { specialMiddleware } from "../../../middleware/special";

async function handler(req, res) {
    // Handle different HTTP methods
    if (req.method === 'POST') {
        const conn = await initializeDatabase()
        try {
            const data = req.body;
            console.log(data);
            const [rows] =  await conn.execute(`
                INSERT INTO
                    mahasiswa_test_tpa
                (
                    test_tpa_id,
                    mahasiswa_id,
                    kelas,
                    status_pengerjaan
                ) VALUES (?,?,?,?)
            `,[
                data.test_tpa_id,
                req.mahasiswa.id,
                data.kelas,
                0
            ]);

            return res.status(200).json({
                "insertId":rows.insertId
            })
        } catch(error){
            console.log(error)
            conn.release();
            return res.status(500).json({})
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default specialMiddleware(handler)