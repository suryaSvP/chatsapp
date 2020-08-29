const io = require("socket.io")(3000);

io.on("connection", (socket) => {
  socket.on("send-chat-message", (msgObj) => {
    addMessageToDb(msgObj);
    let updated = {
      toUpdate: msgObj.reciever
    }
    socket.broadcast.emit("chat-message-updated", updated);
  });
});

const messageTableData = [];


function addMessageToDb(msgObj){
  let message = {
    message: msgObj.message,
    sender: msgObj.sender,
    reciever: msgObj.reciever,
    order:''
  }
  messageTableData.push(message);
}