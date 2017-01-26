/**
 * Created by luojiawei on 16/9/25.
 */
var Vue = require('vue');
var template = require('../../templates/inputwrapper.handlebars');

module.exports = Vue.extend({
    template: template(),
    props: ['msg', 'userInfo', 'contactId'],
    data: function () {
        return {
            input: ''
        }
    },
    methods: {
        submit: function (event) {
            var self = this;
            if(self.input) {
                self.$dispatch('msg-add', self.input);
                self.input = '';
            }
        }
    }
});