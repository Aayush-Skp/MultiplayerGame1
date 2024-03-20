const {createServer} = require("http");
const {Server} =require('socket.io');


const httpServer = createServer();
const io = new Server(httpServer, {
    cors:"http://localhost:3001/"
});

io.on("connection", (socket) => {
  // console.log(socket);
  console.log("new user joined socket "+ socket.id);
});

httpServer.listen(3000);