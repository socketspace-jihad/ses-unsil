import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../middleware/auth"

async function handler(req,res){
    if (req.method === 'POST') {
        const conn = await initializeDatabase();
        try {
            const { test_matkul_id,tpa_score,kelas } = req.body;
            let [rows] =  await conn.execute(`
                SELECT
                    *
                FROM test_matkul_categorized AS tmc
                WHERE
                    test_matkul_id = ?
                    AND tpa_score_lower_limit <= ?
                    AND tpa_score_upper_limit >= ?
            `,[test_matkul_id,tpa_score,tpa_score]);
            if(rows.length == 0){
                return res.status(404).json({
                    "message":"Tidak ada Kategori Tes Matkul yang cocok dengan nilai TPA Anda"
                })
            }
            const categorized_id = rows[0].id;
            [rows] =  await conn.execute(`
                SELECT
                    *
                FROM mahasiswa_test_matkul
                WHERE 
                    test_matkul_categorized_id = ? AND
                    test_matkul_id = ? AND
                    mahasiswa_id = ?
            `,[categorized_id,test_matkul_id,req.user.id]);
            if(rows.length == 0){
                await conn.beginTransaction();
                [rows] =  await conn.execute(`
                    INSERT INTO
                        mahasiswa_test_matkul
                        (
                            test_matkul_id,
                            test_matkul_categorized_id,
                            mahasiswa_id,
                            status_pengerjaan,
                            nama_kelas,
                            start_at
                        ) VALUES (
                            ?,?,?,?,?,NOW()
                        )
                `,[test_matkul_id,categorized_id,req.user.id,0,kelas]);
                console.log("QUERY RESULT",rows);
                await conn.commit();
                return res.status(200).json({
                    "test_matkul_categorized_id":categorized_id,
                    "mahasiswa_test_matkul_id":rows.insertId,
                })
            }
            console.log("SELECT QUERY RESULT",rows);
            return res.status(200).json({
                "test_matkul_categorized_id":categorized_id,
                "mahasiswa_test_matkul_id": rows.id
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

export default authMiddleware(handler)