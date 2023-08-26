const formatTime = require('date-format');

const createMessage = (messageText, username,id) => {
    return {
        messageText,
        createAt: formatTime('dd/MM/yyyy - hh:mm:ss', new Date()),
        username,
        id
    }
}

module.exports = {
    createMessage
}