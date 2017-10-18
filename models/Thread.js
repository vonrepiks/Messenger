const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const threadSchema = new mongoose.Schema({
    users: [{type: types.String, required: true}],
    dateCreated: {type: types.Date, required: true}
});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;