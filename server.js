const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const players = {};

io.on('connection', (socket) => {
  console.log('Someone joined! ID:', socket.id);
  players[socket.id] = { id: socket.id, x: 0, y: 0.5, z: 0, ry: 0, name: 'Guest' };
  io.emit('players', players);

  socket.on('move', (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      players[socket.id].z = data.z;
      players[socket.id].ry = data.ry;
      players[socket.id].name = data.name;
      socket.broadcast.emit('players', players);
    }
  });

  socket.on('videoPlay', (data) => { socket.broadcast.emit('videoPlay', data); });
  socket.on('videoPause', (data) => { socket.broadcast.emit('videoPause', data); });
  socket.on('blowCandle', (data) => { io.emit('blowCandle', data); });
  socket.on('chat', (data) => { socket.broadcast.emit('chat', data); });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('players', players);
  });
});

server.listen(3000, () => {
  console.log('✨ Server running at http://localhost:3000');
});