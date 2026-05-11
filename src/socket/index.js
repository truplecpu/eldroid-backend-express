const { Server } = require('socket.io');
const chatService = require('../services/chatService');
const jwt = require('jsonwebtoken');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Simple JWT auth for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_secret');
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.facultyId;
    console.log(`User connected: ${userId} (${socket.id})`);

    // Join a private room for this user
    socket.join(userId);

    // Handle sending a message
    socket.on('send_message', async (data) => {
      try {
        const { receiver_id, message } = data;
        
        // Save to DB
        const savedMsg = await chatService.saveMessage({
          sender_id: userId,
          receiver_id,
          message,
          sender_type: 'faculty'
        });

        // Emit to receiver's room
        io.to(receiver_id).emit('receive_message', savedMsg);
        
        // Acknowledge back to sender
        socket.emit('message_sent', savedMsg);
      } catch (error) {
        console.error('Chat Error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = initSocket;
