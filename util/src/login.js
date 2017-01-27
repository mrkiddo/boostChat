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
        var maxHeight = Math.max(window.innerHeight, 550);
        loginContainer.css('height', maxHeight + 'px');
    },
    el: '.user-auth'
});