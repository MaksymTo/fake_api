const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    body: String,
    created_at: { type: Date, default: Date.now },
})

const Message = mongoose.model('Message', MessageSchema);

exports.Message = Message;
