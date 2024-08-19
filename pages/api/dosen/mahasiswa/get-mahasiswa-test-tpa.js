
import { initializeDatabase } from "@/dbconfig";
import { specialMiddleware } from "../../../../middleware/special";

async function handler(req, res) {
    // Handle different HTTP methods
    if (req.method === 'GET') {
        const conn = await initializeDatabase()
        try {
            const { test_tpa_id,test_matkul_id } = req.query;
            const [testTPA] =  await conn.execute(`
                SELECT * FROM
                mahasiswa_test_tpa
                WHERE test_tpa_id = ? AND mahasiswa_id = ?
            `,[test_tpa_id,req.mahasiswa.id]);
            if(testTPA.length == 0){
                // INSERT BARU DI SINI
                return res.status(200).json({testTPA,kind: "tpa"})
            }
            if(testTPA[0].status_pengerjaan == 0){
                return res.status(200).json({testTPA, kind:"tpa"})
            }
            const [testMatkul] =  await conn.execute(`
                SELECT * FROM
                mahasiswa_test_matkul
                WHERE test_matkul_id = ? AND mahasiswa_id = ?
            `,[test_matkul_id,req.mahasiswa.id]);
            if(testMatkul.length == 0){
                // INSERT BARU
                return res.status(200).json({testMatkul,testTPA,kind:"matkul"})
            }
            return res.status(200).json({testMatkul,testTPA,kind:"matkul"})
        } catch(error){
            console.log(error);
            conn.release();
            return res.status(500).json({})
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export default specialMiddleware(handler)