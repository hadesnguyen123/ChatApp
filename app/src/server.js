const path = require('path');
const express = require('express')
const app = express()
const http = require('http');
const socketio = require('socket.io');
const { Server } = require('socket.io');
const Filter = require('bad-words');

const { count } = require('console');
const port = 8080

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
    socket.on("send message from client to server", (messageText, callback) => {
        const filter = new Filter()
        if (filter.isProfane(messageText)) {
           return callback("messageText is profane") //tục tĩu
        }
        io.emit("send message from server to client", messageText)
        callback()   //khi server gọi callback thì acknowledgements sẽ đc gọi lại
    })

    //ngắt kết nối, mỗi client là 1 socket
    socket.on("disconnect", () => {
        console.log("client left server")
    })
})


httpServer.listen(port, (req, res) => {
    console.log(`App listen at port http://localhost:${port}`)
})



