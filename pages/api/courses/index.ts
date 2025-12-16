import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const decoded = verifyToken(token || '');
  
  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const [rows] = await db.execute(`
        SELECT c.*, 
        COUNT(e.id) as enrolled_count,
        GROUP_CONCAT(u.name SEPARATOR ', ') as enrolled_users
        FROM courses c
        LEFT JOIN enrollments e ON c.id = e.course_id
        LEFT JOIN users u ON e.user_id = u.id
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `);
      
      res.status(200).json({ courses: rows });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'POST') {
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { title, description, image_url } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    try {
      const [result] = await db.execute(
        'INSERT INTO courses (title, description, image_url) VALUES (?, ?, ?)',
        [title, description, image_url]
      );

      res.status(201).json({ message: 'Course created successfully', id: (result as any).insertId });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}