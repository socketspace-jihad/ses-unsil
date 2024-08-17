// Example usage in an API route (src/app/api/login.js)
import { setCookie } from 'cookies-next';
import getConfig from 'next/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initializeDatabase } from '@/dbconfig';

// Secret key for JWT (typically should be stored securely, not hardcoded)
const secretKey = 'your_secret_key';

export default async function handler(req, res) {
    const { npm, nidn, password } = req.body;

    if (!npm || !password) {
        return res.status(400).json({ error: 'npm and password are required' });
    }

    try {
        const connection = await initializeDatabase();

        // Retrieve user data from the database
        let [rows] = await connection.execute('SELECT * FROM mahasiswa WHERE npm = ?', [npm]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid npm or password' });
        }

        const mahasiswa = rows[0];
        [rows] = await connection.execute('SELECT * FROM dosen WHERE nidn = ?', [nidn]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid nidn or password' });
        }

        const dosen = rows[0];

        // Verify password using bcrypt
        const passwordMatch = await bcrypt.compare(password, dosen.password);

        if (!passwordMatch) {
            console.log("USER ADA, TAPI PASS SALAH")
            return res.status(401).json({ error: 'Invalid nidn or password' });
        }

        // Create JWT token
        const token = jwt.sign({
            mahasiswa,
            dosen,
            nidn: dosen.nidn }, secretKey, { expiresIn: '24h' });

        // Set a cookie for authentication
        setCookie('auth-token', token, { req, res, maxAge: 60 * 60 * 24 }); // Example of using cookies-next to set a cookie

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}