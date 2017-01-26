/**
 * Created by luojiawei on 16/9/25.
 */
var Vue = require('vue');
var template = require('../../templates/messageitem.handlebars');

Vue.filter('timeConvert', function (value) {
    if(!value) {
        return value;
    }
    var date = new Date();
    var messageDate = new Date(value);
    var todayStr = date.getFullYear() + '/' +
        (date.getMonth() + 1) + '/' +
        date.getDate();
    var todayStartTime = new Date(todayStr);
    var result = 0;
    if(messageDate.getTime() > todayStartTime.getTime()) {
        result = messageDate.toTimeString().substr(0, 5);
    }
    else {
        result = Math.floor((todayStartTime - messageDate) / 86400000);
        if(result === 0) {
            result = 'yesterday';
        }
        else if(result === 1) {
            result += 'day ago';
        }
        else {
            result += 'days ago';
        }
    }
    return result;
});

module.exports = Vue.extend({
    template: template(),
    props: ['m', 'u']
});