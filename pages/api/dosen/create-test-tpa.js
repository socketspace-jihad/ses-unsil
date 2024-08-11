import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../../middleware/auth"

async function handler(req,res){
    const conn = await initializeDatabase();
    if (req.method === 'POST') {
        try {
            const data = req.body;
            await conn.beginTransaction();
            const [testMatkul] = await conn.execute(`
                INSERT INTO
                    test_tpa
                (
                    dosen_id,
                    name,
                    deskripsi    
                )  VALUES (?,?,?)
            `,[req.user.id,data.name,data.deskripsi])
            for(var soal of data.soal) {
                const [soalRes] = await conn.execute(`
                    INSERT INTO
                        test_tpa_soal
                    (
                        soal,
                        test_tpa_id
                    ) VALUES (
                        ?,? 
                    )
                `,[soal.soal,testMatkul.insertId])
                for(var jawaban of soal.jawaban){
                    const [jawabanRes] = await conn.execute(`
                        INSERT INTO
                            test_tpa_jawaban
                        (
                            test_tpa_soal_id,
                            jawaban,
                            score,
                            penjelasan    
                        ) VALUES (?,?,?,?)
                    `,[soalRes.insertId,jawaban.jawaban,jawaban.score,jawaban.penjelasan])
                }
            }
            await conn.commit();
            return res.status(200).json({testMatkul})
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