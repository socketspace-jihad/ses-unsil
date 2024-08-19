
import { initializeDatabase } from '../../../src/dbconfig.js';
import { authMiddleware } from "../../../middleware/auth";
import { sendEmail } from '../../../utils/sendMail.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';

function generateRandomPassword(length = 10) {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    const allChars = lowercaseChars + uppercaseChars + numbers;
    let password = '';

    // Ensure password contains at least one lowercase, one uppercase, and one number
    password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    // Generate the remaining characters randomly
    for (let i = 3; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to ensure randomness
    return password.split('').sort(() => 0.5 - Math.random()).join('');
}

async function hashPassword(password) {
    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

async function handler(req, res) {
    // Handle different HTTP methods
    if (req.method === 'POST') {
        const conn = await initializeDatabase()
        try {
            const data = req.body;
            const unhashed = generateRandomPassword();
            // MARK !!
            // bagaimana mahasiswa tau passwordnya ini ???
            const pass = await hashPassword(unhashed);
            const [rows] =  await conn.execute(`
                INSERT INTO
                    mahasiswa
                (
                    email,
                    npm,
                    name,
                    contact,
                    angkatan,
                    disability_status,
                    password,
                    nama_kelas
                ) VALUES (?,?,?,?,?,?,?,?)
            `,[
                data.email,
                data.npm,
                data.name,
                data.contact,
                data.angkatan,
                data.disability_status,
                pass,
                "A"
            ]);

            let mail = await sendEmail(data.email,"Smart Exam System - Akses Masuk",`
                Berikut adalah akses masuk ke sistem
                npm: ${data.npm}
                pass: ${unhashed}
                
                Akses ini harus dijaga kerahasiannya
            `)

            console.log(mail);


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