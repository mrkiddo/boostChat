var Vue = require('vue');
var $ = require('jquery');
var template = require('../../templates/login.handlebars');
var userService = require('../services/userService');

module.exports = Vue.extend({
    template: template(),
    data: function () {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        login: function () {
            if(this.email && this.password) {
                var logUserIn = $.post({
                    url: location.protocol + "//" + location.host + '/users/authenticate',
                    data: {
                        email: this.email,
                        password: this.password
                    }
                });

                logUserIn.then(function (data) {
                    if(data.success) {
                        userService.authUser(data.data);
                        location.href = location.href + 'chat';
                    }
                }, function (err) {console.log(err);});
            }
        }
    }
});