const jwt = require('jsonwebtoken');
const supabaseService = require('../services/supabaseService');

class AuthController {
  async login(req, res) {
    const { facultyId, password } = req.body;

    try {
      const user = await supabaseService.getFacultyByNumber(facultyId);

      if (!user) {
        return res.status(404).json({ status: 'error', message: 'Faculty ID not found' });
      }

      // Note: In a real app, use bcrypt.compare(password, user.password_hash)
      // Maintaining the original logic for now as per app.py
      if (user.password_hash === password) {
        const token = jwt.sign(
          { facultyId: user.faculty_id_number, email: user.email },
          process.env.JWT_SECRET || 'your_fallback_secret',
          { expiresIn: '24h' }
        );

        return res.status(200).json({
          status: 'success',
          message: 'Login successful',
          token,
          faculty_data: {
            facultyId: user.faculty_id_number,
            fullName: user.full_name,
            email: user.email,
            phone: user.phone,
            profileImage: user.profile_image
          }
        });
      } else {
        return res.status(401).json({ status: 'error', message: 'Invalid password' });
      }
    } catch (error) {
      console.error('Login Error:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new AuthController();
