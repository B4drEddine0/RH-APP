import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { verifyToken, hashPassword } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const decoded = verifyToken(token || '');
  
  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { search = '', page = '1', limit = '10' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    try {
      let query = 'SELECT id, name, email, job_position, role, birthday, date_hired, profile_picture FROM users';
      let params: any[] = [];
      let paramIndex = 1;

      if (search) {
        query += ` WHERE name LIKE ? OR email LIKE ? OR job_position LIKE ?`;
        params = [`%${search}%`, `%${search}%`, `%${search}%`];
      }

      query += ` LIMIT ? OFFSET ?`;
      params.push(parseInt(limit as string), offset);

      const [rows] = await db.execute(query, params);
      
      
      let countQuery = 'SELECT COUNT(*) as total FROM users';
      let countParams: any[] = [];
      if (search) {
        countQuery += ' WHERE name LIKE ? OR email LIKE ? OR job_position LIKE ?';
        countParams = [`%${search}%`, `%${search}%`, `%${search}%`];
      }
      
      const [countRows] = await db.execute(countQuery, countParams);
      const total = (countRows as any[])[0].total;

      res.status(200).json({
        employees: rows,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'POST') {
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { name, email, password, role, job_position, birthday, date_hired } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
      const hashedPassword = await hashPassword(password);
      
      const [result] = await db.execute(
        'INSERT INTO users (name, email, password, role, job_position, birthday, date_hired) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, email, hashedPassword, role || 'employee', job_position, birthday, date_hired]
      );

      res.status(201).json({ message: 'Employee created successfully', id: (result as any).insertId });
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ message: 'Email already exists' });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}