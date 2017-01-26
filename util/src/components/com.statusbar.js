/**
 * Created by luojiawei on 16/9/25.
 */
var Vue = require('vue');
var template = require('../../templates/statusbar.handlebars');
var userSerivce = require('../services/userService');

module.exports = Vue.extend({
    template: template(),
    props: ['contInfo'],
    watch: {
        'contInfo': function () {
        }
    },
    methods: {
        signOut: function () {
            userSerivce.removeAuth();
            location.href = "http://localhost:3000";
            return false;
        }
    }
});