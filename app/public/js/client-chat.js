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

document.getElementById("btn-share-location").addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Brower not support or cannot find your location")
    } else {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position)
            const { latitude, longitude } = position.coords
            socket.emit("Share location from client to server", { latitude, longitude })
        })
    }
})

socket.on("Share location from server to client", (linkLocation) => {
    console.log(linkLocation)
})