import * as dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { DatabaseConfig } from './config';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

/* database connection */
new DatabaseConfig().connect();

/* http server connection */
const httpServer = createServer(app);

/* socket.io connection */
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

/* health check endpoint */
app.get('/health-check', (req, res) => {
  res.send('Socket.IO server is running');
});

/* web-sockets implementation */
io.on('connection', (socket) => {
  socket.on('message', (s) => {
    console.log(s);

    socket.emit('reply', `Message received: ${s}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

/* app running */
const port = process.env.PORT || 9000;
httpServer.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
