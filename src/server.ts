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

const users: Record<string, string> = {};

/* health check endpoint */
app.get('/health-check', (req, res) => {
  res.send('Socket.IO server is running');
});

/* web-sockets implementation */
io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);

  socket.on('join', (username) => {
    users[username] = socket.id;

    console.log('User added: ', username, ' id: ', socket.id);
  });

  socket.on('chat', (data) => {
    const { to, from, msg } = JSON.parse(data);
    console.log(`${to} --${users[to]}`);

    if (users[to]) {
      socket.to(users[to]).emit('chat', `Message from ${from} to: ${msg}`);
    } else {
      socket.emit('chat', { from: 'Server', msg: `${to} is not online` });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const username in users) {
      if (users[username] === socket.id) {
        delete users[username];
        break;
      }
    }
  });
});

/* app running */
const port = process.env.PORT || 9000;
httpServer.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
