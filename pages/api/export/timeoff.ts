import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const decoded = verifyToken(token || '');
  
  if (!decoded || decoded.role !== 'admin') {
    return res.status(401).json({ message: 'Admin access required' });
  }

  if (req.method === 'GET') {
    try {
      const [rows] = await db.execute(`
        SELECT tor.*, u.name as user_name, u.email as user_email
        FROM time_off_requests tor
        JOIN users u ON tor.user_id = u.id
        ORDER BY tor.created_at DESC
      `);

      const requests = rows as any[];
      
      const headers = ['Employee Name', 'Email', 'Start Date', 'End Date', 'Reason', 'Status', 'Admin Note', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...requests.map(req => [
          `"${req.user_name}"`,
          `"${req.user_email}"`,
          new Date(req.start_date).toLocaleDateString(),
          new Date(req.end_date).toLocaleDateString(),
          `"${req.reason || ''}"`,
          `"${req.status}"`,
          `"${req.admin_note || ''}"`,
          new Date(req.created_at).toLocaleDateString()
        ].join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=timeoff-requests.csv');
      res.status(200).send(csvContent);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}