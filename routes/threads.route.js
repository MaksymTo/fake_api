const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { Thread } = require("../models/thread.model.js");
const { Message } = require("../models/message.model.js");

const JsonService = require('../services/db');

const getUser = async (id, me) => {
    const user = await JsonService.findById('users', id)

    return {
        "_id": user._id,
        "name": user.name,
        "email": user.email,
        "me": id === me
    }
}
const getUserFull = async (id, me) => {
    return {
        ...await JsonService.findById('users', id),
        "me": id === me
    }
}

const getThreadMessages = async (id) => {
    return await JsonService.find((db) => {
        return db.messages.filter((message) => {
            return message.thread === id;
        }).sort((a, b) => {
            a = new Date(a.created_at);
            b = new Date(b.created_at);
            return a > b ? -1 : a < b ? 1 : 0
        })
    })
}

const getThread = async (thread, me) => {
    const users = await Promise.all(thread.users.map(_id => getUser(_id, me)));
    const messages = await getThreadMessages(thread._id)

    return {
        "_id": thread._id,
        "users": users,
        "last_message": messages.length ? messages[0] : "No messages yet",
        "updated_at": thread.updated_at
    }
}

const getThreadFull = async (thread, me) => {
    const users = await Promise.all(thread.users.map(_id => getUserFull(_id, me)));
    const messages = await getThreadMessages(thread._id)

    return {
        "_id": thread._id,
        "users": users,
        "messages": messages,
        "updated_at": thread.updated_at
    }
}

// start a thread
router.post("/", auth, async (req, res) => {
    // TODO: add validation that `body.user._id` user exists

    const {body} = req;

    const thread = new Thread({
        users: [
            {
                _id: req.user._id, // me
            },
            {
                _id: body.user._id // recipient
            }
        ]
    });

    await JsonService.save((db) => db.threads.push(thread) );

    // TODO: make a more presentable response
    res.jsonp(thread);
});

// get all threads
router.get("/", auth, async (req, res) => {
    const threads = await JsonService.find((db) => {
        return db.threads.filter((thread) => {
            return thread.users.some((user) => user === req.user._id);
        })
    })

    res.jsonp(await Promise.all(threads.map(thread => getThread(thread, req.user._id))));
});

// get thread messages
router.get("/messages/:id", auth, async (req, res, next) => {
    const { id } = req.params;

    try {
        const thread = await JsonService.findById("threads", id);

        if (thread) {
            res.jsonp(await getThreadFull(thread, req.user._id));
        } else {
            res.jsonp({ message: 'Thread not found'});
        }
    } catch(err) {
        next(err);
    }
});


// send a message to a thread
router.post("/messages", auth, async (req, res) => {
    // TODO: add validation that `body.user._id` & `body.thread._id` exists

    const {body} = req;

    const message = new Message({
        user: {
            _id: req.user._id, // me
        },
        thread: {
            _id: body.thread._id
        },
        body: body.message.body
    })

    await JsonService.save((db) => db.messages.push(message) );

    // TODO: make a more presentable response
    res.jsonp(message);
});

module.exports = router;
