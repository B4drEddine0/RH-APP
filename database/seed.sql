USE mini_hr_db;

-- Insert predefined evaluations
INSERT INTO evaluations (name, description) VALUES
('Bookkeeping', 'Financial record keeping and accounting skills'),
('VAT', 'Value Added Tax knowledge and compliance'),
('Toolbox', 'Technical tools and software proficiency'),
('Yearwork', 'Annual performance and project completion');

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role, job_position, date_hired) VALUES
('Badr Eddine', 'admin@marabes.nl', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin', 'HR Manager', '2023-01-01');

-- Insert sample employees (password: employee123)
INSERT INTO users (name, email, password, role, job_position, birthday, date_hired) VALUES
('Nabil', 'nabil@marabes.nl', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'employee', 'Accountant', '1990-05-15', '2023-03-01'),
('Jane Smith', 'jane@marabes.nl', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'employee', 'Financial Analyst', '1988-08-22', '2023-02-15'),
('Mike Johnson', 'mike@marabes.nl', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'employee', 'Tax Consultant', '1992-12-10', '2023-04-01');

INSERT INTO courses (title, description, image_url) VALUES
('Advanced Excel Training', 'Master Excel formulas and data analysis', '/images/excel-course.jpg'),
('Tax Law Updates 2024', 'Latest changes in tax regulations', '/images/tax-course.jpg'),
('Financial Reporting Standards', 'IFRS and GAAP compliance training', '/images/finance-course.jpg');

INSERT INTO scores (user_id, evaluation_id, score) VALUES
(2, 1, 85), (2, 2, 72), (2, 3, 90), (2, 4, 78),
(3, 1, 92), (3, 2, 88), (3, 3, 75), (3, 4, 85),
(4, 1, 68), (4, 2, 95), (4, 3, 82), (4, 4, 70);

INSERT INTO enrollments (user_id, course_id) VALUES
(2, 1), (2, 3),
(3, 1), (3, 2), (3, 3),
(4, 2);

INSERT INTO time_off_requests (user_id, start_date, end_date, reason, status) VALUES
(2, '2024-01-15', '2024-01-19', 'Annual vacation', 'approved'),
(3, '2024-02-10', '2024-02-12', 'Medical appointment', 'pending'),
(4, '2024-03-01', '2024-03-05', 'Family visit', 'rejected');