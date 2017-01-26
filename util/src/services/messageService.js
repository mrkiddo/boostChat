/**
 * Created by mrkiddo on 2017/1/9.
 */
var $ = require('jquery');

var messageServiceConfig = {
    baseUrl: ''
};

var messageService = {
    init: function (config) {
        messageServiceConfig.baseUrl = config.baseUrl;
    },
    getList: function (userId, readStatus, limitTo) {
        return $.ajax({
            url: messageServiceConfig.baseUrl + '/messages/list',
            method: 'POST',
            data: {
                userid: userId,
                isread: readStatus,
                limitto: limitTo
            }
        });
    }
};

module.exports = messageService;