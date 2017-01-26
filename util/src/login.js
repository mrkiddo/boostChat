/**
 *
 */
var $ = require('jquery');
var Vue = require('vue');
var componentLogin = require('./components/com.login');

Vue.component('login-panel', componentLogin);

var vm = new Vue({
    el: '.user-auth'
});