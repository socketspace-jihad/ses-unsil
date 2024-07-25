import jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';

const secretKey = 'your_secret_key'; // Replace with your actual secret key

export function checkAuth(req, res) {
  const token = getCookie('authToken', { req, res });

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
