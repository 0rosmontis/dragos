const http = require('http');
const { Server } = require('socket.io');

const PORT = parseInt(process.env.PORT ?? '4000', 10);
const HOST = process.env.HOST ?? '0.0.0.0';
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN ?? '*';

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  socket.on('join', (payload = {}) => {
    const { roomId, userId, userName } = payload;
    if (!roomId) {
      return;
    }

    socket.data = { roomId, userId, userName };
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', { userId, userName, socketId: socket.id });
  });

  socket.on('offer', (payload = {}) => {
    if (!payload.roomId || !payload.offer) {
      return;
    }
    socket.to(payload.roomId).emit('offer', { offer: payload.offer, socketId: socket.id });
  });

  socket.on('answer', (payload = {}) => {
    if (!payload.roomId || !payload.answer) {
      return;
    }
    socket.to(payload.roomId).emit('answer', { answer: payload.answer, socketId: socket.id });
  });

  socket.on('ice-candidate', (payload = {}) => {
    if (!payload.roomId || !payload.candidate) {
      return;
    }
    socket.to(payload.roomId).emit('ice-candidate', { candidate: payload.candidate, socketId: socket.id });
  });

  socket.on('leave', (payload = {}) => {
    const roomId = payload.roomId ?? socket.data?.roomId;
    if (!roomId) {
      return;
    }
    socket.leave(roomId);
    socket.to(roomId).emit('user-left', { socketId: socket.id });
  });

  socket.on('disconnect', () => {
    const roomId = socket.data?.roomId;
    if (roomId) {
      socket.to(roomId).emit('user-left', { socketId: socket.id });
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Signal server listening on http://${HOST}:${PORT}`);
});

