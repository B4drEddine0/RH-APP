import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const decoded = verifyToken(token || '');
  
  if (!decoded || decoded.role !== 'admin') {
    return res.status(401).json({ message: 'Admin access required' });
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { status, admin_note } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    try {
      await db.execute(
        'UPDATE time_off_requests SET status = ?, admin_note = ? WHERE id = ?',
        [status, admin_note, id]
      );

      res.status(200).json({ message: 'Request updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}