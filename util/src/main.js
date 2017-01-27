/**
 * Created by luojiawei on 16/9/21.
 */
var $ = require('jquery');
var Vue = require('vue');
var componentBoostChat = require('./components/com.boostchat.js');
var userService = require('./services/userService');
var messageService = require('./services/messageService');

var auth = userService.checkUserAuth();
if(!auth.valid) {
    $(this.el).hide();
    location.href = location.protocol + "//" + location.host;
}

Vue.component('boost-chat', componentBoostChat);

userService.init({
    baseUrl: location.protocol + "//" + location.host
});

messageService.init({
    baseUrl: location.protocol + "//" + location.host
});

var data = {
    contacts: [],
    messages: {},
    user: {
        id: 0,
        name: ""
    }
};

var vm = new Vue({
    el: '.boost-chat-app',
    data: data,
    ready: function () {
        this.adjustHeight();
        if(!auth.valid) {
            $(this.el).hide();
        }
        else {
            this.user = auth.authData;
        }
    },
    methods: {
        adjustHeight: function () {
            var maxHeight = Math.max(window.innerHeight, 500);
            $(this.$el).css('height', maxHeight + 'px');
        }
    }
});