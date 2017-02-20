/**
 * Created by mrkiddo on 2016/12/26.
 */
var express = require('express');
var router = express.Router();

var messageService = require('../service/messageService');
var userValidate = require('../middlewares/userValidate');

router.use(userValidate);

router.post('/list', function (req, res, next) {
    var userId = req.body.userid || '';
    var isRead = req.body.isread || false;
    var limitTo = req.body.limitto || 10;
    if(!userId) {
        res.status(422).send({
            success: false,
            message: "missing require post data for listing messages"
        });
    }
    var queryPromise = messageService.getList(userId, isRead, limitTo);
    queryPromise.then(function (messages) {
        messages.reverse();
        res.json({
            success: true,
            message: "retrieve user's messages successfully",
            data: messages
        });
    }, function (err) {
        var error = new Error('database error');
        error.status = 500;
        error.message = err.message;
        next(error);
    });
});

router.post('/create', function (req, res, next) {
    var sender = req.body.sender,
        receiver = req.body.receiver,
        content = req.body.content;
    if(!(sender && receiver && content)) {
        res.status(422).send({
            success: false,
            message: "missing require post data for creating a message"
        });
    }
    var createPromise = messageService.create({
        sender: sender,
        receiver: receiver,
        content: content
    });

    createPromise.then(function (doc) {
        res.json({
            success: true,
            message: "create message successfully",
            data: doc
        });
    });
});

router.post('/update', function (req, res, next) {
    var messageId = req.body.messageId,
        attribute = req.body.attribute || "isRead";
    if(!messageId) {
        res.status(422).send({
            success: false,
            message: "missing require post data for updating a message"
        });
    }
    var updatePromise = messageService.update(messageId, attribute);
    updatePromise.then(function (doc) {
        res.json({
            success: true,
            message: "update message successfully",
            data: doc
        });
    });
});

module.exports = router;