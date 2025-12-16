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
      let query = `
        SELECT tor.*, u.name as user_name, u.email as user_email 
        FROM time_off_requests tor 
        JOIN users u ON tor.user_id = u.id
      `;
      let params: any[] = [];

      if (decoded.role !== 'admin') {
        query += ' WHERE tor.user_id = ?';
        params.push(decoded.id);
      }

      query += ' ORDER BY tor.created_at DESC';

      const [rows] = await db.execute(query, params);
      res.status(200).json({ requests: rows });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'POST') {
    const { start_date, end_date, reason } = req.body;

    if (!start_date || !end_date) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    try {
      const [result] = await db.execute(
        'INSERT INTO time_off_requests (user_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)',
        [decoded.id, start_date, end_date, reason]
      );

      res.status(201).json({ message: 'Time off request created successfully', id: (result as any).insertId });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}