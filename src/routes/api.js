const express = require('express');
const authController = require('../controllers/authController');
const facultyController = require('../controllers/facultyController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/auth/login', authController.login);

// Protected routes (require JWT)
router.use(authMiddleware);

router.get('/faculty/:faculty_id', facultyController.getProfile);
router.get('/courses', facultyController.getCourses);
router.get('/courses/:course_id/students', facultyController.getCourseStudents);
router.post('/attendance', facultyController.markAttendance);
router.get('/messages', facultyController.getMessages);
router.get('/chat/history/:receiver_id', chatController.getHistory);
router.get('/schedule/:day', facultyController.getScheduleByDay);
router.get('/faculty/:fid/credentials', facultyController.getFacultyCredentials);

module.exports = router;
