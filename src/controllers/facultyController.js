const supabaseService = require("../services/supabaseService");

class FacultyController {
  async getProfile(req, res) {
    try {
      const profile = await supabaseService.getFacultyProfile(req.params.faculty_id);
      return res.status(200).json({ status: 'success', data: profile });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getAllFaculty(req, res) {
    try {
      const faculty = await supabaseService.getAllFaculty();
      return res.status(200).json({ status: 'success', data: faculty });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getCourses(req, res) {
    try {
      const courses = await supabaseService.getCourses();
      return res.status(200).json({ status: "success", data: courses });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getCourseStudents(req, res) {
    try {
      const students = await supabaseService.getCourseStudents(
        req.params.course_id,
      );
      return res.status(200).json({ status: "success", data: students });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  }

  async markAttendance(req, res) {
    try {
      await supabaseService.markAttendance(req.body);
      return res
        .status(201)
        .json({ status: "success", message: "Attendance recorded" });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getMessages(req, res) {
    try {
      const facultyId = req.user.id || req.user.userId || req.user.facultyId;
      const messages = await supabaseService.getMessages(facultyId);
      return res.status(200).json({ status: "success", data: messages });
    } catch (error) {
      console.error("Fetch Error:", error.message);
      return res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getUniqueParents(req, res) {
    try {
      const parents = await supabaseService.getUniqueParents();
      return res.status(200).json({ status: "success", data: parents });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getScheduleByDay(req, res) {
    try {
      const schedule = await supabaseService.getScheduleByDay(req.params.day);
      return res.status(200).json({ status: "success", data: schedule });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getFacultyCredentials(req, res) {
    try {
      const data = await supabaseService.getFacultyCredentials(req.params.fid);
      return res.status(200).json({
        status: "success",
        data: data.credentials,
        mission: data.mission,
      });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  }
}

module.exports = new FacultyController();
