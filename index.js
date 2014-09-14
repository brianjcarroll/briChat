var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');

var port = Number(process.env.PORT || 5000);

var userColors = [
  '#B19CD9','#DEA5A4','#FF6961',
  '#779ECB','#AEC6CF','#77DD77',
  '#FDFD96','#FFB347','#966FD6',
  '#03C03C','#CFCFC4','#CB99C9',
  '#C23B22','#B39EB5','#51FFC3'
];

function NewUser (name) {
  this.name = name || 'new user';
  this.id = null;
}

var activeUsers = [];
app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.static(__dirname, 'public'));
// app.use(express.static(path.join(__dirname, '/public/css')));
// app.use(express.static(__dirname + '/public/css'));
// app.use(express.static(__dirname + '/public/js'));
// app.use("/images",  express.static(__dirname + '/public/images'));

http.listen(port, function() {
  console.log('listening on ' + port);
});


app.get('/', function(req, res) {
  res.sendFile('index.html');
});

io.on('connection', function(socket) {

  var currentUser = new NewUser();
  var idx = null;

  socket.on('new user', function(name){
    console.log('new user: ' + name);
    var id = this.id;
    currentUser.name = name;
    currentUser.id = id;
    currentUser.color = userColors[Math.floor(Math.random() * 15)];
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
      name: currentUser.name,
      color: currentUser.color
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
