$(document).ready(function(){
  var socket = io();
  var userName = $('#userNameInput');
  var userForm = $('#userNameForm');
  var messageInput = $('#messageInput');
  var messageForm = $('#messageForm');

  var chat = $('.messages');
  var userList = $('.users');

  var message = $('.message');
  var user = $('.user');

  function updateUserList(list){
    $('.users').empty();
    list.forEach(function(person){
      if(person.id == $('.users li').attr('id')){
        console.log($('.users li').attr('id') + ':' + person.id);
      } else {
        $('.users').append($('<li>').addClass('user').attr('id', person.id).text(person.name));
      }
    });
  }

  userName.focus();

  userForm.on('submit', function(){
    socket.emit('new user', userName.val());
    userName.val('');
    $('.welcome').hide();
    $('.chat-room').show();
    messageInput.focus();
    return false;
  });

  socket.on('new user', function(user){
    // $('.users').append($('<li>').addClass('user').attr('id', user.id).text(user.name));
  });

  socket.on('join chat', function(data){
    $('.messages').append($('<li>').addClass('message').text(data.user.name + ' has connected'));
    updateUserList(data.list);
  });

  messageForm.on('submit', function(){
    socket.emit('new msg', messageInput.val());
    messageInput.val('');
    return false;
  });

  socket.on('new msg', function(msg){
    $('.messages').append($('<li>').addClass('message').html('<span class="message-username">'+ msg.name + ': </span>' + '<span class="message-text">' + msg.message + '</span>'));
  });

  socket.on('connect', function(){
    console.log('connected');
  });

  socket.on('user quit', function(user){

    $('.messages').append($('<li>').addClass('message').text(user.name + ' has disconnected'));
    $('#' + user.user.id).remove();
    // updateUserList(user.list);
  });

});
