/**
 * Created by mrkiddo on 2017/2/11.
 */
var passwordService = require('../service/passwordService');
var onlineUserService = require('../service/onlineUserService');

var jwt = require('jsonwebtoken');
var User = require('../models/user');
var Contactlist = require('../models/contactlist');

var userService = {};

userService.findUserExist = function (email, password) {
    var query = User.findOne({email: email, password: password});
    return query.exec();
};

userService.getUserList = function () {
    var query = User.find({});
    query.select("_id, name");
    return query.exec();
};

userService.resetContactList = function (userId) {
    if(!userId) {
        return false;
    }

    var userListLite = [];

    var findContactList = Contactlist.findOne({userid: userId});
    var findAllUsers = User.find({});

    return findAllUsers.exec().then(function (users) {
        users.forEach(function (user) {
            var o = {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                lastModifiedDate: new Date().getTime(),
                isSticky: false,
                isOnline: false
            };
            if(user.id != userId) {
                userListLite.push(o);
            }
        });
        return findContactList.exec();
    }).then(function (doc) {
        if(!doc) {
            var newContactlist = new Contactlist({
                userid: userId,
                list: userListLite
            });
            return newContactlist.save();
        }
        else {
            var updateList = Contactlist.findOneAndUpdate({
                userid: userId
            }, {
                $set: {
                    list: userListLite
                }
            });
            return updateList.exec();
        }
    });
};

module.exports = userService;