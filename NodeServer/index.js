const app = require('express')()
const logs = require('console');
var datetime = Date();

const http = require('http').createServer(app)
// var io = require('socket.io')(80);

PORTValues = process.env.PORT;

app.get('/api/v1/nodechat', (req, res) => {
    res.json({
        Servername: "Node Chat App",
        FE: "Flutter",
        appData: {
            Name: "Pradeep HGK",
            Server: "AWS EC2 Instance",
            PORT: "PORTValues",
        },
        Names: [
            {
                values: "Pradeep",
                timestamp: "dateTime"
            },
            {
                timestamp: "Time"
            }
        ]
    })
    // res.send("Heyyyyyy Node Server is running. Yay!!")
})

//Socket Logic
const socketio = require('socket.io')(http)

socketio.on("connection", (userSocket) => {
    userSocket.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message", data)
        logs.log("User_Connected");
    })
    // //Disconnect Event 
    // userSocket.on("disconnect", (disconnectData) => {
    //     userSocket.broadcast.emit("ReceiceDisconnect", disconnectData);
    //     logs.log("User_Disconnected");
    // })
})

http.listen(process.env.PORT, () => {
    logs.log("Node-http app listening to the port: ", process.env.PORT)
});

// http://34.224.17.169:1594/api/v1/nodechat //Seriver URL