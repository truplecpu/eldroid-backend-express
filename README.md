# Eldroid Backend API

This is the Express.js backend for the Eldroid platform, featuring real-time parent-teacher chat, student management, and attendance tracking.

## 🚀 Quick Start

1.  **Install Dependencies**: `npm install`
2.  **Environment Setup**: Create a `.env` file based on `.env.example`.
3.  **Run Server**: `npm start`
4.  **WebSocket Test**: Open `http://localhost:5000/parent-chat.html` in your browser.

---

## 🔐 Authentication & Test Credentials

### 👨‍🏫 Faculty (Teachers)
Use these credentials to log in via `/api/auth/login`.

| Faculty Name | Faculty ID | Password |
| :--- | :--- | :--- |
| **Prof. Reyes** | `2023-00154` | `reyes123` |
| **Dr. Maria Santos** | `2018-00088` | `santos456` |

### 👪 Parents (Test Profiles)
These profiles are mapped to specific IDs for the chat system. You can log in as these via the dropdown in `parent-chat.html` or the `/api/auth/parent-login` endpoint.

| Parent Name | Assigned ID | Student ID Reference |
| :--- | :--- | :--- |
| **Mrs. Santerna** | `parent_1` | `2021-00124` |
| **Mr. Lacorte** | `parent_2` | `2021-00156` |
| **Mr. Amaya** | `parent_3` | `2023CS092` |
| **Mr. Carbajal** | `parent_4` | `2023CS093` |
| **Mrs. Mata** | `parent_5` | `2023CS094` |
| **Mr. Galagar** | `parent_6` | `2021-00188` |
| **Mrs. Lim** | `parent_7` | `2022-00205` |
| **Mr. Villanueva** | `parent_8` | `2023-00315` |
| **Mrs. Cruz** | `parent_9` | `2021-00188` |

---

## 📡 Core API Endpoints

### 💬 Chat & WebSockets
*   **WebSocket Events**:
    *   `send_message`: `{ receiver_id, message }`
    *   `receive_message`: Emitted to the receiver.
*   **Chat History**: `GET /api/chat/history/:receiver_id` (Requires JWT)

### 🏫 Faculty Routes (Requires JWT)
*   **Profile**: `GET /api/faculty/:faculty_id`
*   **Courses**: `GET /api/courses`
*   **Students**: `GET /api/courses/:course_id/students`
*   **Attendance**: `POST /api/attendance`
*   **Schedule**: `GET /api/schedule/:day`

---

## 🛠 Tech Stack
*   **Server**: Node.js, Express.js
*   **Real-time**: Socket.io
*   **Database**: Supabase (PostgreSQL)
*   **Documentation**: Swagger UI (`/api-docs`)
