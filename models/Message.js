const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const messageSchema = mongoose.Schema({
    content: {type: types.String, max: [20, 'Too many symbols'], required: true},
    user: {type: types.ObjectId, required: true, ref: 'User'},
    isCurrentUser: {type: types.Boolean, default: false},
    isImage: {type: types.Boolean, default: false},
    isLink: {type: types.Boolean, default: false},
    thread: {type: types.ObjectId, required: true, ref: 'Thread'},
    dateCreated: {type: types.Date}
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;