/**
 * Created by mrkiddo on 2016/12/14.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactItem = new Schema({
    id: String,
    name: String,
    lastModifiedDate: String,
    isSticky: Boolean,
    isOnline: Boolean
});

module.exports = mongoose.model('Contactlist', new Schema({
    userid: String,
    list: [contactItem]
}));