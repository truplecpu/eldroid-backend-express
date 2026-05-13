const express = require('express');
const authController = require('../controllers/authController');
const facultyController = require('../controllers/facultyController');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login for faculty
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - facultyId
 *               - password
 *             properties:
 *               facultyId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid password
 *       404:
 *         description: Faculty ID not found
 */
router.post('/auth/login', authController.login);

/**
 * @swagger
 * /api/auth/parent-login:
 *   post:
 *     summary: Demo login for parents
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parentName
 *               - studentId
 *             properties:
 *               parentName:
 *                 type: string
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/auth/parent-login', authController.parentLogin);

/**
 * @swagger
 * /api/parents:
 *   get:
 *     summary: Get unique parent names from messages
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of parents
 */
router.get('/parents', facultyController.getUniqueParents);

// Protected routes (require JWT)
router.use(authMiddleware);

/**
 * @swagger
 * /api/faculty/{faculty_id}:
 *   get:
 *     summary: Get faculty profile
 *     tags: [Faculty]
 *     parameters:
 *       - in: path
 *         name: faculty_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile data
 *       404:
 *         description: Profile not found
 */
router.get('/faculty/:faculty_id', facultyController.getProfile);

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Faculty]
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get('/courses', facultyController.getCourses);

/**
 * @swagger
 * /api/courses/{course_id}/students:
 *   get:
 *     summary: Get students for a specific course
 *     tags: [Faculty]
 *     parameters:
 *       - in: path
 *         name: course_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of students and their grades
 */
router.get('/courses/:course_id/students', facultyController.getCourseStudents);

/**
 * @swagger
 * /api/attendance:
 *   post:
 *     summary: Mark attendance
 *     tags: [Faculty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: integer
 *               student_id:
 *                 type: string
 *               attendance_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Attendance recorded
 */
router.post('/attendance', facultyController.markAttendance);

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get parent messages
 *     tags: [Faculty]
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get('/messages', facultyController.getMessages);

/**
 * @swagger
 * /api/chat/history/{receiver_id}:
 *   get:
 *     summary: Get chat history with a specific user
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: receiver_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat history
 */
router.get('/chat/history/:receiver_id', chatController.getHistory);

/**
 * @swagger
 * /api/schedule/{day}:
 *   get:
 *     summary: Get course schedule for a specific day
 *     tags: [Faculty]
 *     parameters:
 *       - in: path
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daily schedule
 */
router.get('/schedule/:day', facultyController.getScheduleByDay);

/**
 * @swagger
 * /api/faculty/{fid}/credentials:
 *   get:
 *     summary: Get faculty credentials and mission
 *     tags: [Faculty]
 *     parameters:
 *       - in: path
 *         name: fid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Credentials and academic mission
 */
router.get('/faculty/:fid/credentials', facultyController.getFacultyCredentials);

module.exports = router;
