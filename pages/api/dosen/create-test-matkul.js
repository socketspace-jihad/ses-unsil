import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../../middleware/auth"

async function handler(req,res){
    const conn = await initializeDatabase();
    if (req.method === 'POST') {
        try {
            const data = req.body;
            console.log(data);
            await conn.beginTransaction();
            const [testMatkul] = await conn.execute(`
                INSERT INTO
                    test_matkul
                (
                    name,
                    deskripsi,
                    dosen_id,
                    start_date,
                    due_date,
                    need_test_tpa,
                    test_tpa_id,
                    matkul_id
                )  VALUES (?,?,?,?,?,?,?,?)
            `,[
                data.name,
                data.deskripsi,
                req.user.id,
                data.start_date,
                data.due_date,
                1,
                data.test_tpa_id,
                1
            ])
            for(var categorizedTest of data.categorized){
                const [categorized] = await conn.execute(`
                    INSERT INTO
                        test_matkul_categorized
                    (
                        test_matkul_id,
                        tpa_score_lower_limit,
                        tpa_score_upper_limit
                    )
                        VALUES
                    (?,?,?)
                `,[testMatkul.insertId,categorizedTest.score_lower_limit,categorizedTest.score_upper_limit])
                for(var soalTest of categorizedTest.soal){
                    const [soal] = await conn.execute(`
                        INSERT INTO
                            test_matkul_soal
                        (
                            test_matkul_categorized_id,
                            soal    
                        )    VALUES (?,?)
                    `,[categorized.insertId,soalTest.soal])
                    for(var jawabanTest of soalTest.jawaban){
                        const [jawaban] = await conn.execute(`
                            INSERT INTO
                                test_matkul_jawaban
                            (
                                test_matkul_soal_id,
                                jawaban,
                                score,
                                penjelasan    
                            )  VALUES (?,?,?,?)
                        `,[
                            soal.insertId,
                            jawabanTest.jawaban,
                            jawabanTest.score,
                            jawabanTest.penjelasan
                        ])
                    }
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