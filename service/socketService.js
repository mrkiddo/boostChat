/**
 * Created by mrkiddo on 2017/1/10.
 */
var Message = require('../models/message');
var onlineUserService = require('../service/onlineUserService');

var userList = onlineUserService.userList;

var handlers = {
    onDisconnect: function () {
        var socket = this;
        userList.deleteAll(socket.id);
        console.log('a user disconnected');
    },
    onUserInfo: function (data) {
        var socket = this;
        userList.add(socket.id, data.userid);
        socket.broadcast.emit('contactStatusChange', {
            userId: data.userid,
            online: true
        });
    },
    onUserChatMessage: function (data) {
        var socket = this;
        var receiver = data.receiver;
        var sender = data.sender;
        var content = data.content;
        var message = new Message({
            sender: sender,
            receiver: receiver,
            content: content,
            timestamp: new Date().getTime(),
            isRead: false
        });
        message.save().then(function (data) {
            var receiverSocketId = userList.getByUserId(receiver);
            if(receiverSocketId) {
                socket.to(receiverSocketId).emit('incomingChatMessage', data);
            }
        }, function (err) {
        });
    }
};

var onConnection = function (socket) {
    console.log('a user connected');
    socket.on('disconnect', handlers.onDisconnect);
    socket.on('userInfo', handlers.onUserInfo);
    socket.on('userChatMessage', handlers.onUserChatMessage);
};

var socketService = {
    init: function (io) {
        if(!io) {
            return false;
        }
        io.on('connection', onConnection);
    }
};

module.exports = function (socketReference) {
    socketService.init(socketReference);
    return socketReference;
};