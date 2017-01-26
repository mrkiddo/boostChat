/**
 *
 */
var $ = require('jquery');
var Vue = require('vue');
var componentLogin = require('./components/com.login');

Vue.component('login-panel', componentLogin);

var vm = new Vue({
    ready: function () {
        var loginContainer = $(this.$el).find('.container');
        loginContainer.css('height', window.screen.availHeight + 'px');
    },
    el: '.user-auth'
});