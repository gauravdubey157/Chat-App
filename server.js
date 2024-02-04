const express = require('express');
const cors=require('cors')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(cors())

const PORT = process.env.PORT || 7000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chat.html'); 
});

io.on('connection', (socket) => {
    console.log('Connected...');
    socket.on('fileShare', (data) => {
        // Correct usage to emit to all clients in 'data.room' except the sender
        socket.to(data.room).emit('receiveFile', data);
    });
    
    socket.on('joinRoom', ({ names, room }) => {
        socket.username = names;
        socket.room = room;    // Store the room name in the socket session
        socket.join(room);
        socket.to(room).emit('message', { type: 'center', message: `${names} has joined the room` });
    });

    socket.on('message', (msg) => {
        io.to(msg.room).emit('message', msg);
    });

    socket.on('disconnect', () => {
        // Use socket.room, which was stored when the user joined
        if (socket.username && socket.room) {
            io.to(socket.room).emit('message', { type: 'center', message: `${socket.username} has left the room` });
        }
    });
});

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});