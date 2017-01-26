/**
 * Created by mrkiddo on 2016/12/28.
 */
var Message = require('../models/message');

var messageService = {};

messageService.getList = function (userId, readStatus, limitTo) {
    var queryCondition = {
        $and: [
            {isRead: readStatus},
            {
                $or: [
                    {receiver: userId},
                    {sender: userId}
                ]
            }
        ]
    };
    var query = Message.find(queryCondition).limit(parseInt(limitTo)).sort({$natural:-1});
    return query.exec();
};

messageService.create = function (message) {
    var newMessage = {};
    if(message.sender) {
        newMessage.sender = message.sender;
    }
    else {
        return false;
    }
    if(message.receiver) {
        newMessage.receiver = message.sender;
    }
    else {
        return false;
    }
    if(message.content) {
        newMessage.content = message.content;
    }
    else {
        return false;
    }
    newMessage.timestamp = new Date().getTime();
    newMessage.isRead = false;
    var instance = new Message(newMessage);
    return instance.save();
};

messageService.update = function (messageId, attribute) {
    var updateDoc = {};
    if(attribute == "isRead") {
        updateDoc["isRead"] = true;
    }
    var query = Message.findOneAndUpdate({
        "_id": messageId
    }, {
        "$set": updateDoc
    });
    return query.exec();
};

module.exports = messageService;