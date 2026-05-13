require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const initSocket = require('./socket');
const { swaggerUi, specs } = require('./config/swagger');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Swagger Documentation
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss:
    '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
  customCssUrl: CSS_URL,
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
  ]
}));

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
