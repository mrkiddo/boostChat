/**
 * Created by luojiawei on 16/9/25.
 */
var Vue = require('vue');
var template = require('../../templates/statusbar.handlebars');

module.exports = Vue.extend({
    template: template(),
    props: ['contInfo'],
    watch: {
        'contInfo': function () {
        }
    }
});