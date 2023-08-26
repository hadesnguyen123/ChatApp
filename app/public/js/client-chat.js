// yêu cầu kết nối từ server với client
const socket = io();


//xử lý send message
document.getElementById("form-messages").addEventListener("submit", (e) => {
    e.preventDefault()  //ngăn load trang
    const messageText = document.getElementById("input-messages").value
    const acknowledgements = (errors) => {
        if (errors) {
            return alert(errors)
        } else {
            console.log("You were success sending message")
        }
    }
    socket.emit("send message from client to server", messageText, acknowledgements)
})

//xử lý nhận message
socket.on("send message from server to client", (message) => {
    console.log("messageText:", message)
    const { createAt, messageText } = message
    const messageHtmlElement = `
        <div class="message-item">
            <div class="message__row1">
                <p class="message__name">Some One</p>
                <p class="message__date">${createAt}</p>
            </div>
            <div class="message__row2">
                <p class="message__content">
                    ${messageText}
                </p>
            </div>
        </div>
    `
    // let contentHtml = document.getElementById("app-messages").innerHTML
    document.getElementById("app-messages").innerHTML += messageHtmlElement
})

//xử lý location
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

//xử lý nhận location
socket.on("Share location from server to client", (linkLocation) => {
    console.log(linkLocation)
})

//xử lý query string
console.log(location.search);
try {
    const { room, username } = Qs.parse(location.search, {
        ignoreQueryPrefix: true
    })
    socket.emit("join room from client to server", { room, username })
    document.getElementById("app-room").innerHTML = room
} catch (error) {
    console.log(error)
}

//nhận danh sách người dùng
socket.on("send userList from server to client", (userList) => {
    console.log("userList:", userList)
    let contentListUserHtml = ''
    userList.map((user, index) => {
        contentListUserHtml += `
            <li class="app__item-user" ${index}>${user.username}</li>
        `
    })
    document.getElementById("list-user").innerHTML = contentListUserHtml
})
