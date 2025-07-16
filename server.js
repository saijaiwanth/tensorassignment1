const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId; 

    const clients = io.sockets.adapter.rooms.get(roomId);
    if (clients && clients.size > 1) {
      socket.to(roomId).emit('user-joined');
    }

    socket.on('offer', data => {
      socket.to(roomId).emit('offer', data);
    });

    socket.on('answer', data => {
      socket.to(roomId).emit('answer', data);
    });

    socket.on('ice-candidate', data => {
      socket.to(roomId).emit('ice-candidate', data);
    });
  });

  socket.on('disconnect', () => {
    if (socket.roomId) {
      console.log(`User disconnected from room: ${socket.roomId}`);
      socket.to(socket.roomId).emit('user-left');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
