// middleware/auth.js

import jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';

const secretKey = 'your_secret_key'; // Replace with your actual secret key

export function specialMiddleware(handler) {
  return async (req, res) => {
    try {
      const token = getCookie('auth-token', { req, res });

      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const decoded = jwt.verify(token, secretKey);
      req.data = decoded;
      req.dosen = req.data.dosen;
      req.mahasiswa = req.data.mahasiswa;

      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}
