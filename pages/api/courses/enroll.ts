import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const decoded = verifyToken(token || '');
  
  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { course_id } = req.body;

    if (!course_id) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    try {
      await db.execute(
        'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
        [decoded.id, course_id]
      );

      res.status(201).json({ message: 'Enrolled successfully' });
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ message: 'Already enrolled in this course' });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}