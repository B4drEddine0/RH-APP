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
        SELECT name, email, job_position, role, birthday, date_hired, created_at
        FROM users
        ORDER BY name
      `);

      const employees = rows as any[];
      
   
      const headers = ['Name', 'Email', 'Job Position', 'Role', 'Birthday', 'Date Hired', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...employees.map(emp => [
          `"${emp.name}"`,
          `"${emp.email}"`,
          `"${emp.job_position || ''}"`,
          `"${emp.role}"`,
          emp.birthday ? new Date(emp.birthday).toLocaleDateString() : '',
          emp.date_hired ? new Date(emp.date_hired).toLocaleDateString() : '',
          new Date(emp.created_at).toLocaleDateString()
        ].join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=employees.csv');
      res.status(200).send(csvContent);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}