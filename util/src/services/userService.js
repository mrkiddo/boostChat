/**
 * Created by mrkiddo on 2016/11/20.
 */
var $ = require('jquery');

var userServiceConfig = {
    baseUrl: ''
};

var userService = {
    init: function (config) {
        userServiceConfig.baseUrl = config.baseUrl;
    },
    authUser: function (authData) {
        var o = authData;
        localStorage.setItem('user-auth-email', o.email);
        localStorage.setItem('user-auth-userid', o.id);
        localStorage.setItem('user-auth-name', o.name);
        localStorage.setItem('user-auth-token', o.token);
        localStorage.setItem('user-auth-avatar', o.avatar);
        return authData;
    },
    checkUserAuth: function () {
        var authToken = localStorage.getItem('user-auth-token'),
            email = localStorage.getItem('user-auth-email'),
            name = localStorage.getItem('user-auth-name'),
            id = localStorage.getItem('user-auth-userid'),
            avatar = localStorage.getItem('user-auth-avatar');
        var result = {
            valid: true,
            authData: {
                token: authToken,
                email: email,
                name: name,
                userid: id,
                avatar: avatar
            }
        };
        if(authToken) {
            $.ajaxSetup({
                headers: {
                    'x-access-token': authToken
                }
            });
            return result;
        }
        else {
            return {
                valid: false
            };
        }
    },
    removeAuth: function () {
        localStorage.removeItem('user-auth-email');
        localStorage.removeItem('user-auth-userid');
        localStorage.removeItem('user-auth-name');
        localStorage.removeItem('user-auth-token');
        localStorage.removeItem('user-auth-avatar');
    },
    getUserList: function (userId) {
        return $.ajax({
            url: userServiceConfig.baseUrl + '/users/contactlist/' + userId
        });
    },
    updateContactSticky: function (userId, contactId, stickyStatus) {
        return $.ajax({
            url: userServiceConfig.baseUrl + '/users/contactlist/update',
            method: 'POST',
            data: {
                userid: userId,
                contactUserid: contactId,
                sticky: stickyStatus
            }
        });
    },
    sortContactlist: function (list) {
        var stickyList = [];
        var commonList = [];
        for(var i = 0; i < list.length; i++) {
            if(list[i].isSticky) {
                stickyList.push(list[i]);
            }
            else {
                commonList.push(list[i]);
            }
        }
        stickyList.sort(function (a, b) {
            return b.lastModifiedDate - a.lastModifiedDate;
        });
        return stickyList.concat(commonList);
    }
};

module.exports = userService;