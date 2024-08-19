import { initializeDatabase } from "@/dbconfig";
import { authMiddleware } from "../../../middleware/auth"

async function handler(req,res){
    const conn = await initializeDatabase();
    if (req.method === 'PUT') {
        try {
            const data = req.body;
            console.log(data.ids);
            await conn.beginTransaction();
            for(var id of data.ids){
                console.log("ID",id);
                const [_] = await conn.execute(`
                    UPDATE mahasiswa
                    SET active_status = 1
                    WHERE id = ?
                `,[id])
            }
            await conn.commit();
            return res.status(200).json({data})
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