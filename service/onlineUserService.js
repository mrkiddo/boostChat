/**
 * Created by mrkiddo on 2017/1/17.
 */
var onlineUserList = {};

var userList = {
    getByUserId: function (userId) {
        if(onlineUserList[userId] && onlineUserList[userId].length > 0) {
            return onlineUserList[userId];
        }
        else {
            return false;
        }
    },
    add: function (socketId, userId) {
        if(!onlineUserList[userId]) {
            onlineUserList[userId] = [];
            onlineUserList[userId].push(socketId);
        }
        else {
            onlineUserList[userId].push(socketId);
        }
    },
    delete: function (socketId) {
        for(var user in onlineUserList) {
            var userSockets = onlineUserList[user];
            for(var i = 0; i < userSockets.length; i++) {
                if(userSockets[i] == socketId) {
                    userSockets.splice(i, 1);
                    break;
                }
            }
        }
    },
    deleteAll: function (socketId) {
        var userId = '';
        for(var user in onlineUserList) {
            var userSockets = onlineUserList[user];
            for(var i = 0; i < userSockets.length; i++) {
                if (userSockets[i] == socketId) {
                    userId = user;
                    break;
                }
            }
        }
        if(userId) {
            onlineUserList[userId] = [];
        }
    }
};

module.exports = {
    onlineUserList: onlineUserList,
    userList: userList
};