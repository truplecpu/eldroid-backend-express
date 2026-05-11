require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const initSocket = require('./socket');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize WebSockets
const io = initSocket(server);

// Attach io to request object to use in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Eldroid Backend (Express.js) is running...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
