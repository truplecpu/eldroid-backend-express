-- ELDROID DATABASE SCHEMA (PostgreSQL / Supabase)

-- COURSES TABLE
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    room_assignment VARCHAR(100),
    schedule_days VARCHAR(100), -- Expanded for full day names
    schedule_time VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STUDENTS TABLE
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_id_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GRADES & ENROLLMENT TABLE (Junction Table)
CREATE TABLE student_grades (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    midterm_grade NUMERIC(5,2),
    finals_grade NUMERIC(5,2),
    current_grade NUMERIC(5,2),
    status VARCHAR(20), -- e.g., 'ON TRACK', 'NEEDS REVIEW', 'CRITICAL'
    UNIQUE(course_id, student_id)
);

-- ATTENDANCE TABLE
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(1) CHECK (status IN ('P', 'L', 'A')), -- Present, Late, Absent
    UNIQUE(course_id, student_id, attendance_date)
);

-- MESSAGES/INBOX TABLE (Parent Messages)
CREATE TABLE parent_messages (
    id SERIAL PRIMARY KEY,
    sender_name VARCHAR(100) NOT NULL,
    student_relation VARCHAR(100),
    message_preview TEXT,
    received_time VARCHAR(50), 
    unread_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FACULTY TABLE
CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    faculty_id_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    academic_mission TEXT,
    password_hash VARCHAR(255),
    profile_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FACULTY CREDENTIALS TABLE
CREATE TABLE faculty_credentials (
    id SERIAL PRIMARY KEY,
    faculty_id_number VARCHAR(50) REFERENCES faculty(faculty_id_number) ON DELETE CASCADE,
    degree_title VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    year_obtained VARCHAR(10) NOT NULL,
    type VARCHAR(50) DEFAULT 'degree' -- 'degree' or 'certification'
);

-- CHAT MESSAGES TABLE (Real-time Messaging)
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    sender_id VARCHAR(50) NOT NULL,
    receiver_id VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    sender_type VARCHAR(20) NOT NULL, -- 'faculty' or 'parent'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INITIAL DATA SEEDING
-- ==========================================

-- INSERT FACULTY
INSERT INTO faculty (faculty_id_number, full_name, email, phone, address, academic_mission, password_hash, profile_image) VALUES
('2023-00154', 'Prof. Reyes', 'reyes.prof@university.edu', '0917 123 4567', 'University of Cebu - Main Campus, Cebu City', 'Dedicated to advancing the frontiers of cybersecurity through research and education.', 'reyes123', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&auto=format&fit=crop'),
('2018-00088', 'Dr. Maria Santos', 'santos.m@university.edu', '0918 987 6543', 'Mandaue City, Cebu', 'Empowering the next generation of software engineers.', 'santos456', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop');

-- INSERT COURSES
INSERT INTO courses (course_code, course_name, room_assignment, schedule_days, schedule_time) VALUES
('CS101', 'Computer Science I', 'Room RM 402 • Engineering Bldg', 'Monday, Wednesday', '09:00 AM - 10:30 AM'),
('CS202', 'Data Structures & Algorithms', 'Lab 3 • IT Building', 'Monday, Wednesday, Friday', '01:00 PM - 02:30 PM'),
('IT101', 'Introduction to Computing', 'Lab B', 'Tuesday, Thursday', '02:45 PM - 04:15 PM'),
('IT102', 'Computer Programming II', 'Lab A', 'Tuesday, Thursday', '09:00 AM - 10:30 AM'),
('CS301', 'Database Management Systems', 'Room 305', 'Monday, Wednesday, Friday', '10:30 AM - 12:00 PM'),
('IT205', 'Web Development', 'Lab C', 'Monday, Wednesday, Friday', '03:00 PM - 05:00 PM'),
('CS405', 'Artificial Intelligence', 'Room 401', 'Tuesday, Thursday', '01:00 PM - 03:00 PM');

-- INSERT STUDENTS
INSERT INTO students (student_id_number, first_name, last_name) VALUES
('2021-00124', 'Julianne Marie', 'Abad'),
('2021-00156', 'Lorenzo', 'Bautista'),
('2023CS092', 'Samuel', 'Chen'),
('2023CS093', 'Maria', 'Garcia'),
('2023CS094', 'Juan', 'Reyes'),
('2021-00188', 'Miguel', 'Cruz'),
('2022-00201', 'Sofia', 'Gonzales'),
('2022-00205', 'Ethan', 'Lim'),
('2023-00301', 'Isabella', 'Torres'),
('2023-00315', 'Liam', 'Villanueva'),
('2021-00199', 'Chloe', 'Sy'),
('2022-00250', 'Alexander', 'Mercado'),
('2023-00405', 'Zoe', 'Navarro'),
('2021-00111', 'Gabriel', 'Ramos'),
('2022-00222', 'Mia', 'Flores');

-- INSERT GRADES (Course IDs 1, 2, 3)
INSERT INTO student_grades (course_id, student_id, midterm_grade, current_grade, status) VALUES
(2, 1, 92.0, 92.0, 'ON TRACK'),     
(2, 2, 78.0, 78.0, 'NEEDS REVIEW'), 
(2, 3, 88.0, 88.0, 'ON TRACK'),     
(2, 4, 90.0, 90.0, 'ON TRACK'),     
(2, 5, 75.0, 75.0, 'NEEDS REVIEW'),
(2, 6, 85.0, 85.0, 'ON TRACK'),     
(2, 7, 95.0, 95.0, 'ON TRACK'),
(1, 8, 88.5, 88.5, 'ON TRACK'),     
(1, 9, 91.0, 91.0, 'ON TRACK'),     
(1, 10, 72.0, 72.0, 'CRITICAL'),    
(1, 11, 84.0, 84.0, 'ON TRACK'),    
(1, 12, 79.5, 79.5, 'NEEDS REVIEW'),
(3, 13, 96.0, 96.0, 'ON TRACK'),    
(3, 14, 82.0, 82.0, 'ON TRACK'),    
(3, 15, 89.0, 89.0, 'ON TRACK');

-- INSERT ATTENDANCE
INSERT INTO attendance (course_id, student_id, attendance_date, status) VALUES
(2, 3, '2026-04-06', 'P'), 
(2, 4, '2026-04-06', 'P'), 
(2, 5, '2026-04-06', 'P'),
(2, 6, '2026-04-06', 'L'),
(2, 7, '2026-04-06', 'P'), 
(2, 1, '2026-04-03', 'P'), 
(2, 2, '2026-04-03', 'A'),
(2, 3, '2026-04-03', 'P'), 
(2, 4, '2026-04-03', 'P'), 
(2, 5, '2026-04-03', 'P'),
(1, 8, '2026-04-06', 'P'), 
(1, 9, '2026-04-06', 'P'), 
(1, 10, '2026-04-06', 'A');

-- INSERT MESSAGES
INSERT INTO parent_messages (sender_name, student_relation, message_preview, received_time, unread_count) VALUES
('Mrs. Santerna', 'Andrea''s Mother', 'I''ll be late for the pick up today.', '2 min ago', 1),
('Mr. Lacorte', 'Daryl''s Father', 'Thank you for the update on the project.', '10:30 AM', 0),
('Mr. Amaya', 'Carl''s Father', 'Will there be a field trip form sent home?', 'Yesterday', 0),
('Mr. Carbajal', 'Albert''s Father', 'Regarding the math homework from last week...', 'Yesterday', 0),
('Mrs. Mata', 'Beryl''s Mother', 'She has a doctor''s appointment tomorrow morning.', 'Apr 04', 0),
('Mr. Galagar', 'Mark''s Father', 'Can we schedule a parent-teacher conference?', 'Apr 03', 1),
('Mrs. Lim', 'Ethan''s Mother', 'Ethan left his textbook in the lab.', 'Apr 02', 0),
('Mr. Villanueva', 'Liam''s Father', 'Please excuse Liam''s absence, he is sick.', 'Apr 01', 2),
('Mrs. Cruz', 'Miguel''s Mother', 'Is there any extra credit available for the midterm?', 'Mar 28', 0);

-- INSERT CREDENTIALS
INSERT INTO faculty_credentials (faculty_id_number, degree_title, institution, year_obtained, type) VALUES 
('2023-00154', 'Ph.D. in Computer Science', 'Stanford University', '2018', 'degree'),
('2023-00154', 'M.Sc. in Information Technology', 'MIT', '2014', 'degree'),
('2023-00154', 'Certified Ethical Hacker (CEH)', 'EC-Council', '2021', 'certification'),
('2018-00088', 'Ph.D. in Software Engineering', 'Carnegie Mellon University', '2012', 'degree'),
('2018-00088', 'M.Sc. in Computer Engineering', 'National University of Singapore', '2008', 'degree'),
('2018-00088', 'Professional Scrum Master (PSM I)', 'Scrum.org', '2020', 'certification');
