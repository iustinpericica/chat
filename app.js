let express = require('express');
let socket = require('socket.io');

let keys = new Array();

let app = express();


app.get('/', (req, res) => {

    res.sendFile(__dirname + '/index.html');

});

app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/style.css');
});

app.get('/main.js', (req, res) => {
    res.sendFile(__dirname + '/main.js');
});

let server = app.listen(3000, (err) => {
    if (err) throw err;
    else console.log('Server is running just fine');
});

let io = socket(server);

io.on('connection', function (socket) {

    console.log('New connection has been made ', socket.id);

    socket.on('user', (user) => {

        if (!socket.user) {

            let found_one = keys.find((key)=>key.user == user);

            if(!found_one){keys.push(
                {id: socket.id, user: user}
            )}
            else io.to(socket.id).emit('user_exists');

            

        }

        io.sockets.emit('users', keys);

    });

    socket.on('chat', function (data) {
        io.sockets.emit('chat', data);

    });

    socket.on('typing', function (data) {

        socket.broadcast.emit('typing', data);

    });

    socket.on('to', function(data){

        let socket_id = keys.find( (socket) => socket.user == data.to);

        
        if(socket_id){

        socket.to(socket_id.id).emit('chat', {
            user: data.user,
            message: data.message
        });
    }

    });

})


