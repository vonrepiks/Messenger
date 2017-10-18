const User = require('../models/User');
const Message = require('../models/Message');
const Thread = require('../models/Thread');
const flashMessages = require('../util/flash_messages');
const messageChecker = require('../util/message_checker');

module.exports = {

    getChatRoom: async (req, res) => {
        let currentlyLoggedInUser = req.user.username;
        let otherUserUsername = req.params.username;

        let thread = await Thread.findOne({users: {$all: [currentlyLoggedInUser, otherUserUsername]}});

        if (!thread) {
            flashMessages(req, 'error', 'Thread no longer exists');
            return res.redirect('/');
        }

        let messages = await Message.find({'thread': thread._id}).sort({dateCreated: 1}).populate('user');

        for (let message of messages) {
            message.isCurrentUser = message.user.username === req.user.username;
        }

        res.locals.messages = messages;

        res.render('thread/chat-room', thread);

    },
    postChatRoom: async (req, res) => {
        let currentlyLoggedInUser = req.user.username;
        let otherUserUsername = req.params.username;

        let thread = await Thread.findOne({users: {$all: [currentlyLoggedInUser, otherUserUsername]}});

        if (!thread) {
            flashMessages(req, 'error', 'Thread no longer exists');
            return res.redirect('/');
        }

        let messageContent = req.body.content;

        let messageObj = {
            content: messageContent,
            user: req.user.id,
            thread: thread._id,
            isImage: messageChecker.isImage(messageContent),
            isLink: messageChecker.isLink(messageContent),
            dateCreated: Date.now()
        };

        let message = await Message.create(messageObj);

        res.redirect(req.originalUrl);
    }
};
