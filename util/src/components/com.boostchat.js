/**
 * Created by luojiawei on 16/9/21.
 */
var Vue = require('vue');
var template = require('../../templates/boostchat.handlebars');
var componentContactList = require('./com.contactlist');
var componentStatusBar = require('./com.statusbar');
var componentMessageWrapper = require('./com.messagewrapper');
var componentInputWrapper = require('./com.inputwrapper');
var $ = require('jquery');
var io = require('socket.io-client');
var userService = require('../services/userService');
var messageService = require('../services/messageService');

var extraMessage = [
    {id: 10, sender: "1", content: "This is previous message.", time: "20 min ago"},
    {id: 11, sender: "1", content: "This is previous message, too.", time: "18 min ago"}
];

module.exports = Vue.extend({
    template: template(),
    props: ['messages', 'user'],
    components: {
        'contact-list': componentContactList,
        'status-bar': componentStatusBar,
        'message-wrapper': componentMessageWrapper,
        'input-wrapper': componentInputWrapper
    },
    data: function () {
        return {
            contacts: [],
            currentContactId: 0,
            currentContact: '',
            disabledInput: true,
            currentMessages: [],
            showHistoryRecord: {},
            showHistoryFlag: true,
            socket: {}
        };
    },
    ready: function () {
    },
    created: function () {
        var self = this;
        var auth = userService.checkUserAuth();
        if(!auth.valid) {
            return;
        }
        var userId = auth.authData.userid;
        self.user = auth.authData;
        self.setContactData(userId);
        self.socket = io();
        self.socket.on('incomingChatMessage', self.getNewMessage);
        self.socket.on('contactStatusChange', self.changeContactStatus);
        self.socket.emit('userInfo', auth.authData);
    },
    watch: {
        'currentContactId': function () {
            var self = this;
            if(self.messages && self.messages[self.currentContactId]) {
                self.currentMessages = self.messages[self.currentContactId];
            }
            else {
                self.messages[self.currentContactId] = [];
                var getMessages = messageService.getList(self.currentContactId, false, 10);
                $.when(getMessages).then(function (result) {
                    self.messages[self.currentContactId] = result.data;
                    self.currentMessages = self.messages[self.currentContactId];
                }, function (err) {});
                self.currentMessages = self.messages[self.currentContactId];
            }
            if(self.showHistoryRecord && self.showHistoryRecord[self.currentContactId]) {
                self.showHistoryFlag = false;
            }
            else {
                self.showHistoryFlag = true;
            }
        }
    },
    events: {
        'msg-request-history': function (userId) {
            if(this.user.id == userId) {
                this.currentMessages = extraMessage.concat(this.currentMessages);
                this.showHistoryRecord[this.currentContactId] = 1;
                this.showHistoryFlag = false;
            }
        },
        'msg-add': function (content) {
            var self = this;
            var newMessage = {
                sender: self.user.userid,
                receiver: self.currentContactId,
                content: content
            };
            self.currentMessages.push(newMessage);
            self.socket.emit('userChatMessage', newMessage);
        }
    },
    methods: {
        setContactData: function (userId) {
            var self = this;
            var contactListPromise = userService.getUserList(userId);
            $.when(contactListPromise).then(function (contactList) {
                var list = contactList.data.list;
                self.contacts = userService.sortContactlist(list);
            });
        },
        getNewMessage: function (message) {
            var self = this;
            var sender = message.sender;
            if(self.messages[sender]) {
                self.messages[sender].push(message);
            }
            else {
                self.messages[sender] = [];
                self.messages[sender].push(message);
            }
        },
        changeContactStatus: function (status) {
            var self = this;
            self.contacts.some(function (element) {
                if(element.id == status.userId) {
                    element.isOnline = status.online;
                    return true;
                }
                else {
                    return false;
                }
            });
        }
    }
});