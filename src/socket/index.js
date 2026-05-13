const { Server } = require("socket.io");
const chatService = require("../services/chatService");
const jwt = require("jsonwebtoken");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Simple JWT auth for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_fallback_secret",
      );
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.userId || socket.user.facultyId;
    const userType = socket.user.userType || "faculty";
    console.log(`User connected: ${userId} as ${userType} (${socket.id})`);

    // Join a private room for this user
    socket.join(userId);

    // Handle sending a message
    // Handle sending a message
    socket.on("send_message", async (data) => {
      try {
        const { receiver_id, message } = data;

        const savedMsg = await chatService.saveMessage({
          sender_id: userId,
          receiver_id,
          message,
          sender_type: userType,
        });

        const payload = {
          ...savedMsg,
          // Check for 'parentName' (from parentLogin) or 'fullName' (from faculty login)
          sender_name:
            socket.user.parentName || socket.user.fullName || "Parent",
        };

        io.to(receiver_id).emit("receive_message", payload);
        socket.emit("message_sent", payload);
      } catch (error) {
        console.error("Chat Error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initSocket;
