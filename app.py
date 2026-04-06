import os
from flask import Flask, jsonify, request
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SECRET_KEY") # Use Secret Key for backend
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    faculty_id = data.get('facultyId')
    password = data.get('password')

    try:
        response = supabase.table("faculty").select("*").eq("faculty_id_number", faculty_id).execute()
        
        if len(response.data) == 0:
            return jsonify({"status": "error", "message": "Faculty ID not found"}), 404
            
        user = response.data[0]
        
        if user['password_hash'] == password:
            return jsonify({
                "status": "success",
                "message": "Login successful",
                "faculty_data": {
                    "facultyId": user['faculty_id_number'],
                    "fullName": user['full_name'],
                    "email": user['email'],
                    "phone": user['phone'],
                    "profileImage": user["profile_image"]
                }
            }), 200
        else:
            return jsonify({"status": "error", "message": "Invalid password"}), 401
            
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



@app.route('/api/faculty/<faculty_id>', methods=['GET'])
def get_profile(faculty_id):
    try:
        response = supabase.table("faculty").select("*").eq("faculty_id_number", faculty_id).execute()
        if len(response.data) > 0:
            return jsonify({"status": "success", "data": response.data[0]}), 200
        return jsonify({"status": "error", "message": "Profile not found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/courses', methods=['GET'])
def get_courses():
    try:
        response = supabase.table("courses").select("*").execute()
        return jsonify({"status": "success", "data": response.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/courses/<int:course_id>/students', methods=['GET'])
def get_course_students(course_id):
    try:
        response = supabase.table("student_grades") \
            .select("*, students(student_id_number, first_name, last_name)") \
            .eq("course_id", course_id) \
            .execute()
            
        return jsonify({"status": "success", "data": response.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



@app.route('/api/attendance', methods=['POST'])
def mark_attendance():
    data = request.json
    
    try:
        response = supabase.table("attendance").upsert({
            "course_id": data.get("course_id"),
            "student_id": data.get("student_id"),
            "attendance_date": data.get("attendance_date"),
            "status": data.get("status")
        }).execute()
        
        return jsonify({"status": "success", "message": "Attendance recorded"}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



@app.route('/api/messages', methods=['GET'])
def get_messages():
    try:
        response = supabase.table("parent_messages").select("*").order("id", desc=True).execute()
        return jsonify({"status": "success", "data": response.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/schedule/<day>', methods=['GET'])
def get_schedule_by_day(day):
    try:
        response = supabase.table("courses") \
            .select("*") \
            .ilike("schedule_days", f"%{day}%") \
            .execute()
            
        return jsonify({"status": "success", "data": response.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/faculty/<fid>/credentials', methods=['GET'])
def get_faculty_credentials(fid):
    try:
        creds = supabase.table("faculty_credentials") \
            .select("*") \
            .eq("faculty_id_number", fid) \
            .execute()
        
        profile = supabase.table("faculty") \
            .select("academic_mission") \
            .eq("faculty_id_number", fid) \
            .single() \
            .execute()

        return jsonify({
            "status": "success", 
            "data": creds.data,
            "mission": profile.data.get('academic_mission', 'Academic mission not set.')
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)