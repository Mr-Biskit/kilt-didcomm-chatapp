const io = require("socket.io")(5000, {
    cors: {
        origin: "http://localhost:5173",
    },
});

let activeUser = [];

io.on("connection", (socket) => {
    // add new user
    socket.on("new-user-add", ({ peerId, newUserId }) => {
        // if user is not added previously
        if (!activeUser.some((user) => user.userId === newUserId)) {
            activeUser.push({
                userId: newUserId,
                socketId: socket.id,
                peerId: peerId,
            });
        }
        console.log("user connected", activeUser);
        io.emit("get-users", activeUser);
    });
    socket.on("send-user-to-call", ({ senderId, receiverId }) => {
        console.log("users-tobe-connnected", senderId, receiverId);
        const sender = activeUser.find((user) => user.userId === senderId);
        const receiver = activeUser.find((user) => user.userId === receiverId);
        io.to(sender.socketId).emit("make-call", receiver.peerId);
    });
    socket.on("make-answer", ({ senderId, receiverId }) => {
        const sender = activeUser.find((user) => user.userId === senderId);
        const receiver = activeUser.find((user) => user.userId === receiverId);
        io.to(receiver.socketId).emit("answer-made", sender.peerId);
    });

    // send message

    socket.on("send-message", (data) => {
        const user = activeUser.find((user) => user.userId === data.receiverId);
        console.log("Sending from socket to reciever");
        if (user) {
            io.to(user.socketId).emit("recieve-message", data);
        }
    });
    socket.on("disconnect", () => {
        activeUser = activeUser.filter((user) => user.socketId !== socket.id);
        console.log("user disconnecet", activeUser);
        io.emit("get-users", activeUser);
    });
});
