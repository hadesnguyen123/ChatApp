let userList = [
    {
        id: "1",
        username: "Nguyễn Hoàng",
        room: "FU1"
    },
    {
        id: "2",
        username: "Trần Vy",
        room: "FU1"
    },
    {
        id: "3",
        username: "Nguyễn Văn Vượng",
        room: "FU2"
    }
]

const addUser = (newUser) => {
    userList = [...userList, newUser]
}
const removeUser = (id) => userList = userList.filter(user => user.id !== id)

const getUserList = (room) => userList.filter(user => user.room == room)

const getUser = (id) => userList.find(user => user.id === id)

module.exports = {
    getUserList,
    addUser,
    removeUser,
    getUser
}