const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

const Thread = mongoose.model('Thread', ThreadSchema);

exports.Thread = Thread;
