import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [decoded.id]
    );
    
    const users = rows as any[];
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: users[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}