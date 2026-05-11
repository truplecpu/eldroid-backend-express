const supabase = require('../config/supabase');

class SupabaseService {
  async getFacultyByNumber(facultyIdNumber) {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .eq('faculty_id_number', facultyIdNumber)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  }

  async getFacultyProfile(facultyId) {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .eq('faculty_id_number', facultyId)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async getCourseStudents(courseId) {
    const { data, error } = await supabase
      .from('student_grades')
      .select('*, students(student_id_number, first_name, last_name)')
      .eq('course_id', courseId);
    
    if (error) throw error;
    return data;
  }

  async markAttendance(attendanceData) {
    const { data, error } = await supabase
      .from('attendance')
      .upsert({
        course_id: attendanceData.course_id,
        student_id: attendanceData.student_id,
        attendance_date: attendanceData.attendance_date,
        status: attendanceData.status
      });
    
    if (error) throw error;
    return data;
  }

  async getMessages() {
    const { data, error } = await supabase
      .from('parent_messages')
      .select('*')
      .order('id', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getScheduleByDay(day) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .ilike('schedule_days', `%${day}%`);
    
    if (error) throw error;
    return data;
  }

  async getFacultyCredentials(fid) {
    const credsResponse = await supabase
      .from('faculty_credentials')
      .select('*')
      .eq('faculty_id_number', fid);
    
    if (credsResponse.error) throw credsResponse.error;

    const profileResponse = await supabase
      .from('faculty')
      .select('academic_mission')
      .eq('faculty_id_number', fid)
      .single();
    
    if (profileResponse.error) throw profileResponse.error;

    return {
      credentials: credsResponse.data,
      mission: profileResponse.data.academic_mission || 'Academic mission not set.'
    };
  }
}

module.exports = new SupabaseService();
