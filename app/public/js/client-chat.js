// yêu cầu kết nối từ server với client
const socket = io();

document.getElementById("form-message").addEventListener("submit", (e) => {
    e.preventDefault()  //ngăn load trang
    const messageText = document.getElementById("input-message").value
    const acknowledgements = (errors) => {
        if (errors) {
            return alert(errors)
        } else {
            console.log("You were success sending message")
        }
    }
    socket.emit("send message from client to server", messageText, acknowledgements)
})

socket.on("send message from server to client", (messageText) => {
    console.log("messageText:", messageText)
})