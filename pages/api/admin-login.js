// Example usage in an API route (src/app/api/login.js)
import { initializeDatabase } from '../../src/dbconfig.js';
import { setCookie } from 'cookies-next';
import getConfig from 'next/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Secret key for JWT (typically should be stored securely, not hardcoded)
const secretKey = 'your_secret_key';

export default async function handler(req, res) {
    const { nidn, password } = req.body;

    if (!nidn || !password) {
        return res.status(400).json({ error: 'nidn and password are required' });
    }

    try {
        const connection = await initializeDatabase();

        // Retrieve user data from the database
        const [rows] = await connection.execute('SELECT * FROM dosen WHERE nidn = ?', [nidn]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid nidn or password' });
        }

        const user = rows[0];

        // Verify password using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            console.log("USER ADA, TAPI PASS SALAH")
            return res.status(401).json({ error: 'Invalid nidn or password' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user.id, nidn: user.nidn }, secretKey, { expiresIn: '1h' });

        // Set a cookie for authentication
        setCookie('auth-token', token, { req, res, maxAge: 60 * 60 * 24 }); // Example of using cookies-next to set a cookie

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}