const supabase = require("../config/supabase");

class SupabaseService {
  async getFacultyByNumber(facultyIdNumber) {
    const { data, error } = await supabase
      .from("faculty")
      .select("*")
      .eq("faculty_id_number", facultyIdNumber)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  async getFacultyProfile(facultyId) {
    const { data, error } = await supabase
      .from("faculty")
      .select("*")
      .eq("faculty_id_number", facultyId)
      .single();

    if (error) throw error;
    return data;
  }

  async getAllFaculty() {
    const { data, error } = await supabase
      .from("faculty")
      .select("faculty_id_number, full_name");

    if (error) throw error;
    return data;
  }

  async getCourses() {
    const { data, error } = await supabase.from("courses").select("*");
    if (error) throw error;
    return data;
  }

  async getCourseStudents(courseId) {
    const { data, error } = await supabase
      .from("student_grades")
      .select("*, students(student_id_number, first_name, last_name)")
      .eq("course_id", courseId);

    if (error) throw error;
    return data;
  }

  async markAttendance(attendanceData) {
    const { data, error } = await supabase.from("attendance").upsert({
      course_id: attendanceData.course_id,
      student_id: attendanceData.student_id,
      attendance_date: attendanceData.attendance_date,
      status: attendanceData.status,
    });

    if (error) throw error;
    return data;
  }

  async getMessages(userId) {
    // 1. Fetch all messages for this teacher
    const { data: messages, error: msgError } = await supabase
      .from("chat_messages")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (msgError) throw msgError;

    // 2. Get a list of all unique parent_ids from these messages
    const parentIds = [
      ...new Set(
        messages.map((m) =>
          m.sender_id === userId ? m.receiver_id : m.sender_id,
        ),
      ),
    ];

    // 3. Look up the names in your NEW 'parents' table (from image_2ad4fb.png)
    const { data: parentProfiles } = await supabase
      .from("parents")
      .select("parent_id, full_name")
      .in("parent_id", parentIds);

    // 4. Create a map for quick lookup: { "parent_1": "Mrs. Santerna" }
    const nameMap = {};
    if (parentProfiles) {
      parentProfiles.forEach((p) => {
        nameMap[p.parent_id] = p.full_name;
      });
    }

    // 5. Group by parent and attach the names
    const uniqueInbox = [];
    const seen = new Set();

    messages.forEach((msg) => {
      const otherParty =
        msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

      if (!seen.has(otherParty)) {
        seen.add(otherParty);
        uniqueInbox.push({
          ...msg,
          // Replace the ID with the name from your new table
          sender_name: nameMap[otherParty] || "Parent",
        });
      }
    });

    return uniqueInbox;
  }

  async getUniqueParents() {
    const { data, error } = await supabase
      .from("parents")
      .select("parent_id, full_name, student_id");

    if (error) throw error;
    return data;
  }

  async getParentById(parentId) {
    const { data, error } = await supabase
      .from("parents")
      .select("*")
      .eq("parent_id", parentId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  async getParentByName(fullName) {
    const { data, error } = await supabase
      .from("parents")
      .select("*")
      .eq("full_name", fullName)
      .single();

    return { data, error };
  }

  async getScheduleByDay(day) {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .ilike("schedule_days", `%${day}%`);

    if (error) throw error;
    return data;
  }

  async getFacultyCredentials(fid) {
    const credsResponse = await supabase
      .from("faculty_credentials")
      .select("*")
      .eq("faculty_id_number", fid);

    if (credsResponse.error) throw credsResponse.error;

    const profileResponse = await supabase
      .from("faculty")
      .select("academic_mission")
      .eq("faculty_id_number", fid)
      .single();

    if (profileResponse.error) throw profileResponse.error;

    return {
      credentials: credsResponse.data,
      mission:
        profileResponse.data.academic_mission || "Academic mission not set.",
    };
  }
}

module.exports = new SupabaseService();
