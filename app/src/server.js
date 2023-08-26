const path = require('path');
const express = require('express')
const app = express()
const http = require('http');
const socketio = require('socket.io');
const { Server } = require('socket.io');
const Filter = require('bad-words');
const formatTime = require('date-format');
const { createMessage } = require('./utils/create-message');
const { getUserList, addUser, removeUser, getUser } = require('./utils/users');

const messageServer = "send message from server to client"
const messageClient = "send message from client to server"


const publicPathDirectory = path.join(__dirname, "../public")
app.use(express.static(publicPathDirectory))

//tạo server
const httpServer = http.createServer(app);

//khởi tạo socket
const io = socketio(httpServer)

//khi client gọi io() thì nó sẽ gửi lên server 1 connection
//lắng nghe sự kiện kết nối từ client
io.on("connection", (socket) => {
    console.log("new client connect")
    //nhận events join từ client
    socket.on("join room from client to server", ({ room, username }) => {
        //join user to room
        socket.join(room)

        //gửi cho client vừa connect
        socket.emit(
            messageServer,
            createMessage(`Welcome ${username} to Chat App, room: ${room}`, 'Admin', ''))

        //gửi cho client còn lại
        socket.broadcast.to(room).emit(
            messageServer,
            createMessage(`Client ${username} were join chat room: ${room}`, 'Admin', ''))

        //chat
        socket.on(messageClient, (messageText, callback) => {
            const filter = new Filter()
            if (filter.isProfane(messageText)) {
                return callback("messageText is profane") //tục tĩu
            }
            const id = socket.id
            console.log(id)
            const user = getUser(id)

            io.to(room).emit(
                messageServer,
                createMessage(messageText, user.username, id))
            callback()   //khi server gọi callback thì acknowledgements sẽ đc gọi lại
        })

        //chia sẻ location
        socket.on("Share location from client to server", ({ latitude, longitude }) => {
            const id = socket.id
            const user = getUser(id)
            const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`
            io.emit("Share location from server to client", createMessage(linkLocation, user.username))
        })

        //userList
        addUser(newUser = {
            id: socket.id,
            username: username,
            room: room
        })
        io.to(room).emit("send userList from server to client", getUserList(room))

        //ngắt kết nối, mỗi client là 1 socket
        socket.on("disconnect", () => {
            removeUser(socket.id)
            io.to(room).emit("send userList from server to client", getUserList(room))
            console.log("client left server")
        })
    })
})

const port = process.env.PORT || 8080
httpServer.listen(port, (req, res) => {
    console.log(`App listen at port http://localhost:${port}`)
})



