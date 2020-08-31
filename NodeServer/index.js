// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 1594;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

// Routing
// app.use(express.static(path.join(__dirname, 'public')));
app.get('/getname', (req, res) => {
    res.json({
        Name: "Pradeep",
        date: "01020303"
    })
})
// Chatroom

var numUsers = 0;

io.on('connection', (socket) => {
    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', (data) => {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', (username) => {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });

        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});

//#region 
// const app = require('express')()
// var path = require('path');
// const logs = require('console');
// var datetime = Date();

// const http = require('http').createServer(app)
// // var io = require('socket.io')(80);

// port = process.env.PORT || 1594;

// // Routing
// app.use(app.static(path.join(__dirname, 'public')));

// app.get('/api/v1/nodechat', (req, res) => {
//     res.json({
//         Servername: "Node Chat App",
//         FE: "Flutter",
//         appData: {
//             Name: "Pradeep HGK",
//             Server: "AWS EC2 Instance",
//             PORT: "PORTValues",
//         },
//         Names: [
//             {
//                 values: "Pradeep",
//                 timestamp: "dateTime"
//             },
//             {
//                 timestamp: "Time"
//             }
//         ]
//     })
//     // res.send("Heyyyyyy Node Server is running. Yay!!")
// })

// //Socket Logic
// const socketio = require('socket.io')(http)

// socketio.on("connection", (userSocket) => {
//     userSocket.on("send_message", (data) => {
//         userSocket.broadcast.emit("receive_message", data)
//         logs.log("User_Connected");
//     })
//     // //Disconnect Event 
//     // userSocket.on("disconnect", (disconnectData) => {
//     //     userSocket.broadcast.emit("ReceiceDisconnect", disconnectData);
//     //     logs.log("User_Disconnected");
//     // })
// })

// http.listen(port, () => {
//     logs.log("Node-http app listening to the port: ", port)
// });

// // http://34.224.17.169:1594/api/v1/nodechat //Seriver URL
//#endregion