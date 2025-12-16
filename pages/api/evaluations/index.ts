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
      if (decoded.role === 'admin') {
        const [rows] = await db.execute(`
          SELECT 
            e.id,
            e.name,
            e.description,
            COUNT(s.id) as total_scores,
            SUM(CASE WHEN s.score BETWEEN 0 AND 30 THEN 1 ELSE 0 END) as bucket_0_30,
            SUM(CASE WHEN s.score BETWEEN 31 AND 50 THEN 1 ELSE 0 END) as bucket_31_50,
            SUM(CASE WHEN s.score BETWEEN 51 AND 70 THEN 1 ELSE 0 END) as bucket_51_70,
            SUM(CASE WHEN s.score BETWEEN 71 AND 100 THEN 1 ELSE 0 END) as bucket_71_100
          FROM evaluations e
          LEFT JOIN scores s ON e.id = s.evaluation_id
          GROUP BY e.id, e.name, e.description
          ORDER BY e.name
        `);
        
        res.status(200).json({ evaluations: rows });
      } else {
        const [rows] = await db.execute(`
          SELECT e.name, e.description, s.score, s.created_at
          FROM evaluations e
          LEFT JOIN scores s ON e.id = s.evaluation_id AND s.user_id = ?
          ORDER BY e.name
        `, [decoded.id]);
        
        res.status(200).json({ evaluations: rows });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'POST') {
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { user_id, evaluation_id, score } = req.body;

    if (!user_id || !evaluation_id || score === undefined) {
      return res.status(400).json({ message: 'User ID, evaluation ID, and score are required' });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({ message: 'Score must be between 0 and 100' });
    }

    try {
      
      const [existing] = await db.execute(
        'SELECT id FROM scores WHERE user_id = ? AND evaluation_id = ?',
        [user_id, evaluation_id]
      );

      if ((existing as any[]).length > 0) {
        await db.execute(
          'UPDATE scores SET score = ? WHERE user_id = ? AND evaluation_id = ?',
          [score, user_id, evaluation_id]
        );
      } else {
        await db.execute(
          'INSERT INTO scores (user_id, evaluation_id, score) VALUES (?, ?, ?)',
          [user_id, evaluation_id, score]
        );
      }

      res.status(200).json({ message: 'Score saved successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}