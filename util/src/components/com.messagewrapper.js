/**
 * Created by luojiawei on 16/9/25.
 */
var Vue = require('vue');
var template = require('../../templates/messagewrapper.handlebars');
var componentMessageItem = require('./com.messageitem');

Vue.component('message-item', componentMessageItem);

module.exports = Vue.extend({
    template: template(),
    props: ['msg', 'userInfo', 'showHistoryBar'],
    watch: {
        'msg': function (value, oldValue) {
            this.$el.scrollTop = this.$el.scrollHeight;
        },
        'userInfo': function (value) {
            this.userInfo = value;
        }
    },
    methods: {
        showHistory: function () {
            this.$dispatch('msg-request-history', this.userInfo.id);
        }
    }
});