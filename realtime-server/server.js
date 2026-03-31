const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const { setupSportsHandler } = require('./handlers/sportsHandler');
const { setupTrendingHandler } = require('./handlers/trendingHandler');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', connections: io.engine.clientsCount });
});

const sportsNamespace = io.of('/sports');
const trendingNamespace = io.of('/trending');

sportsNamespace.on('connection', (socket) => {
  console.log(`[Sports] Client connected: ${socket.id}`);
  setupSportsHandler(socket, sportsNamespace);
  socket.on('disconnect', () => {
    console.log(`[Sports] Client disconnected: ${socket.id}`);
  });
});

trendingNamespace.on('connection', (socket) => {
  console.log(`[Trending] Client connected: ${socket.id}`);
  setupTrendingHandler(socket, trendingNamespace);
  socket.on('disconnect', () => {
    console.log(`[Trending] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Realtime server running on port ${PORT}`);
});
