# Parent-Side WebSocket Implementation Guide

This guide explains how to integrate the Eldroid real-time chat system into a Parent-side application (Mobile or Web) using Socket.io.

## 1. Authentication
Before connecting to the WebSocket, you must obtain a JWT token by "logging in" the parent.

**Endpoint**: `POST /api/auth/parent-login`  
**Payload**:
```json
{
  "parentName": "Mrs. Santerna"
}
```
**Response**:
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1Ni...",
  "parent_data": {
    "userId": "parent_1",
    "parentName": "Mrs. Santerna",
    "studentId": "2021-00124"
  }
}
```
*Save the `token` and `userId` for the next steps.*

---

## 2. Establishing Connection
Use the `socket.io-client` library to connect to the backend. You **must** pass the token in the `auth` object.

```javascript
import { io } from "socket.io-client";

const socket = io("https://your-backend-url.com", {
  auth: {
    token: "YOUR_JWT_TOKEN_HERE"
  }
});

socket.on("connect", () => {
  console.log("Connected to Eldroid Chat Server as:", socket.id);
});
```

---

## 3. Loading Chat History
It is recommended to fetch existing messages via REST before starting the real-time session.

**Endpoint**: `GET /api/chat/history/:teacher_id`  
**Header**: `Authorization: Bearer YOUR_JWT_TOKEN`

---

## 4. Sending a Message
To send a message to a teacher, use the `send_message` event.

**Event**: `send_message`  
**Data Structure**:
```javascript
const messageData = {
  receiver_id: "2023-00154", // The ID of the Teacher/Faculty
  message: "Good morning, teacher. How is my child doing?"
};

socket.emit("send_message", messageData);
```

---

## 5. Receiving a Message
Listen for the `receive_message` event to handle replies from the teacher.

**Event**: `receive_message`  
**Example**:
```javascript
socket.on("receive_message", (data) => {
  console.log("New Message Received:");
  console.log("From:", data.sender_id); // Will be the Teacher's ID
  console.log("Content:", data.message);
  console.log("Time:", data.created_at);
  
  // Update your UI here
});
```

---

## 6. Error Handling
The server emits an `error` event if a message fails to save or send.

```javascript
socket.on("error", (err) => {
  console.error("Chat Error:", err.message);
});
```

---

## 💡 Summary of Events

| Event Name | Direction | Description |
| :--- | :--- | :--- |
| `send_message` | Client → Server | Sends a message to a teacher. |
| `message_sent` | Server → Client | Acknowledgement that your message was saved/sent. |
| `receive_message`| Server → Client | Triggered when a teacher sends you a message. |
| `error` | Server → Client | Triggered on authentication or database errors. |
