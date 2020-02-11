const path = require('path'); // build-in nodejs
const express = require('express');
const http = require('http');// build-in nodejs
const socketIO = require('socket.io');
const { messageStructure, messageStructureLocation } = require('./messageTemplates/message');
const Room = require('./../models/room');
const room = new Room();

const app = express();
const publicPath = path.join(__dirname + '/../public');
app.use('/', express.static(publicPath))

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New User connected');
  socket.on("newUser", message => {
    console.log(message)
    const user = room.addUser(socket.id, message.name, message.room);
    socket.join(user.room);
    socket.on('newMessageFromClient', message => {
      io.to(user.room).emit('sendMessageFromServer', messageStructure(
        message.from,
        message.content
      ))
    })

    socket.on('newMessageFromClient', message => {
      // console.log(message));
      io.emit('sendMessageFromServer', messageStructure(
        message.from,
        message.content,
        message.createAt
      ));
    })

    io.emit('listOfUser', {
      users: room.findUserByRoomName(user.room)
    })
  })


  socket.on('locationFromClient', message => {
    // console.log(message);
    io.to(user.room).emit('locationFromServer', messageStructureLocation(
      message.from,
      message.lng,
      message.lat
    ));
  })

  socket.broadcast.emit('newUser', messageStructure(
    'Server',
    'New User to Join'
  ))


  socket.emit('Welcome', messageStructure(
    'Server',
    'newUser',
    'Welcome to the Chat App'
  ))
  socket.on('disconnect', () => {
    console.log('User was disconnected');
    const removeUser = room.removeUserById(socket.id);
    // console.log(removeUser);
    if (removeUser) {
      io.to(room).emit('sendMessageFromServer', messageStructure(
        "Admin",
        `${removeUser.name} left room`
      ))
      io.emit('listOfUser', {
        users: room.findUserByRoomName(user.room)
      })
    }
  })
})

const port = process.env.PORT || 9000

server.listen(port, () => {
  console.log(`Port Listen ${port}`);
})