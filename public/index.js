var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');

function NewUser (name) {
  this.name = name || 'new user';
  this.id = null;
}

var activeUsers = [];

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname, 'public'));
// app.use(express.static(path.join(__dirname, '/public/css')));

// app.use(express.static(__dirname + '/public/css'));
// app.use(express.static(__dirname + '/public/js'));
// app.use("/images",  express.static(__dirname + '/public/images'));

app.get('brichat.herokuapp.com', function(req, res) {
  res.sendFile('index.html');
    if (reqq.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
    console.log('favicon requested');
    return;
  }
});

io.on('connection', function(socket) {

  var currentUser = new NewUser();
  var idx = null;




  socket.on('new user', function(name){
    console.log('new user: ' + name);
    var id = this.id;
    currentUser.name = name;
    currentUser.id = id;
    activeUsers.push(currentUser);

    io.emit('new user', currentUser);
    io.emit('join chat', {
      list: activeUsers,
      user: currentUser
    });
    console.log(activeUsers);
  });



  socket.on('new msg', function(msg){
    console.log(msg);
    io.emit('new msg', {
      message: msg,
      name: currentUser.name
      });
  });

  socket.on('disconnect', function(){
    var id = this.id;
    console.log(id);
    console.log('disconnected');
    activeUsers.forEach(function(user){
      if(user.id === id){
        var idx = activeUsers.indexOf(user);
        return activeUsers.splice(idx, 1);

      } else {
        console.log('some other user');
      }

    });
    console.log(activeUsers);
    io.emit('user quit', {
        user: currentUser,
        name: currentUser.name,
        list: activeUsers
      });
  });

});

app.listen(app.get('port'), function() {
  console.log('listening on *:8080');
});
