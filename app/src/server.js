const path = require('path');
const express = require('express')
const app = express()
const http = require('http');
const socketio = require('socket.io');
const { Server } = require('socket.io');
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

    let count = 1
    const message = "Hello World"
    //truyền từ server về client
    socket.emit("send count server to client", count)
    socket.emit("send message server to client", message)

    //nhận sự kiện từ client tới server
    socket.on("send increment client to server", () => {
        count++
        socket.emit("send count server to client", count)
    })

    //ngắt kết nối, mỗi client là 1 socket
    socket.on("disconnect", () => {
        console.log("client left server")
    })
})


httpServer.listen(port, (req, res) => {
    console.log(`App listen at port http://localhost:${port}`)
})



