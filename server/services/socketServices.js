// server/services/socketServices.js
import { Server as SocketServer } from 'socket.io';
let io;

const initializeSocket = (server) => {
  io = new SocketServer(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

export { initializeSocket, io };
