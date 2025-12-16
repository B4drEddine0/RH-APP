import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    const users = rows as any[];
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isValid = await comparePassword(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}