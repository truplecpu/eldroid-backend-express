-- ELDROID DATABASE SCHEMA (PostgreSQL / Supabase)

-- 1. INDEPENDENT TABLES
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_id_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    room_assignment VARCHAR(100),
    schedule_days VARCHAR(100),
    schedule_time VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DEPENDENT TABLES
CREATE TABLE parents (
    id SERIAL PRIMARY KEY,
    parent_id VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'parent_1'
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    student_id VARCHAR(20) REFERENCES students(student_id_number) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_grades (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    midterm_grade NUMERIC(5,2),
    finals_grade NUMERIC(5,2),
    current_grade NUMERIC(5,2),
    status VARCHAR(20),
    UNIQUE(course_id, student_id)
);

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(1) CHECK (status IN ('P', 'L', 'A')),
    UNIQUE(course_id, student_id, attendance_date)
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    sender_id VARCHAR(50) NOT NULL,
    receiver_id VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    sender_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE faculty_credentials (
    id SERIAL PRIMARY KEY,
    faculty_id_number VARCHAR(50) REFERENCES faculty(faculty_id_number) ON DELETE CASCADE,
    degree_title VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    year_obtained VARCHAR(10) NOT NULL,
    type VARCHAR(50) DEFAULT 'degree'
);

-- LEGACY (Keeping for compatibility if needed, but 'parents' table is preferred now)
CREATE TABLE parent_messages (
    id SERIAL PRIMARY KEY,
    sender_name VARCHAR(100) NOT NULL,
    student_relation VARCHAR(100),
    message_preview TEXT,
    received_time VARCHAR(50), 
    unread_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INITIAL DATA SEEDING
-- ==========================================

-- A. SEED STUDENTS (First, because parents and grades depend on them)
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

-- B. SEED FACULTY
INSERT INTO faculty (faculty_id_number, full_name, email, phone, address, academic_mission, password_hash, profile_image) VALUES
('2023-00154', 'Prof. Reyes', 'reyes.prof@university.edu', '0917 123 4567', 'University of Cebu - Main Campus, Cebu City', 'Dedicated to advancing the frontiers of cybersecurity through research and education.', 'reyes123', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&auto=format&fit=crop'),
('2018-00088', 'Dr. Maria Santos', 'santos.m@university.edu', '0918 987 6543', 'Mandaue City, Cebu', 'Empowering the next generation of software engineers.', 'santos456', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop');

-- C. SEED PARENTS (Depends on Students)
INSERT INTO parents (parent_id, full_name, student_id) VALUES
('parent_1', 'Mrs. Santerna', '2021-00124'),
('parent_2', 'Mr. Lacorte', '2021-00156'),
('parent_3', 'Mr. Amaya', '2023CS092'),
('parent_4', 'Mr. Carbajal', '2023CS093'),
('parent_5', 'Mrs. Mata', '2023CS094'),
('parent_6', 'Mr. Galagar', '2021-00188'),
('parent_7', 'Mrs. Lim', '2022-00205'),
('parent_8', 'Mr. Villanueva', '2023-00315'),
('parent_9', 'Mrs. Cruz', '2021-00188');

-- D. SEED COURSES
INSERT INTO courses (course_code, course_name, room_assignment, schedule_days, schedule_time) VALUES
('CS101', 'Computer Science I', 'Room RM 402 • Engineering Bldg', 'Monday, Wednesday', '09:00 AM - 10:30 AM'),
('CS202', 'Data Structures & Algorithms', 'Lab 3 • IT Building', 'Monday, Wednesday, Friday', '01:00 PM - 02:30 PM'),
('IT101', 'Introduction to Computing', 'Lab B', 'Tuesday, Thursday', '02:45 PM - 04:15 PM'),
('IT102', 'Computer Programming II', 'Lab A', 'Tuesday, Thursday', '09:00 AM - 10:30 AM'),
('CS301', 'Database Management Systems', 'Room 305', 'Monday, Wednesday, Friday', '10:30 AM - 12:00 PM'),
('IT205', 'Web Development', 'Lab C', 'Monday, Wednesday, Friday', '03:00 PM - 05:00 PM'),
('CS405', 'Artificial Intelligence', 'Room 401', 'Tuesday, Thursday', '01:00 PM - 03:00 PM');

-- E. SEED GRADES
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
