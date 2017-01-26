/**
 * Created by mrkiddo on 2016/12/26.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
    sender: String,
    receiver: String,
    timestamp: {
        type: Date,
        default: new Date().getTime()
    },
    content: String,
    isRead: Boolean
}));