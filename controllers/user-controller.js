const User = require('../models/User');
const Thread = require('../models/Thread');
const encryption = require('../util/encryption');
const flashMessages = require('../util/flash_messages');

module.exports = {
    register: {
        get: (req, res) => {
            res.render('user/register')
        },
        post: (req, res) => {
            let userData = req.body;

            if (
                userData.password &&
                userData.password !== userData.confirmedPassword
            ) {
                flashMessages(req, 'error', 'Passwords do not match');
                res.redirect(req.originalUrl);
                return;
            }

            let salt = encryption.generateSalt();
            userData.salt = salt;

            if (userData.password) {
                userData.hashedPass = encryption.generateHashedPassword(
                    salt,
                    userData.password
                )
            }

            User.create(userData)
                .then(user => {
                    req.logIn(user, (err, user) => {
                        if (err) {
                            flashMessages(req, 'error', 'Wrong credentials!');
                            res.redirect(req.originalUrl);
                            return;
                        }

                        flashMessages(req, 'success', 'Successfully register.');
                        res.redirect('/')
                    })
                })
                .catch(error => {
                    userData.error = error;
                    res.render('user/register', userData)
                })
        }
    },
    login: {
        get: (req, res) => {
            res.render('user/login')
        },
        post: (req, res) => {
            let userData = req.body;
            User.findOne({username: userData.username}).then(user => {
                if (!user || !user.authenticate(userData.password)) {
                    flashMessages(req, 'error', 'Wrong credentials!');
                    res.redirect(req.originalUrl);
                    return;
                }

                req.logIn(user, (err) => {
                    if (err) {
                        flashMessages(req, 'error', 'Wrong credentials!');
                        res.redirect(req.originalUrl);
                        return;
                    }

                    flashMessages(req, 'success', 'Successfully login.');
                    res.redirect('/')
                })
            })
        }
    },
    logout: (req, res) => {
        req.logout();
        flashMessages(req, 'success', 'Successfully logout.');
        res.redirect('/');
    },
    find: async (req, res) => {

        let reqUsername = req.query.username;
        try {
            let user = await User.findOne({'username': reqUsername});

            if (!user) {
                flashMessages(req, 'error', 'Wrong username!');
                res.redirect('/');
            } else {
                let currentlyLoggedInUser = req.user.username;
                let otherUser = user.username;

                if (currentlyLoggedInUser === otherUser) {
                    flashMessages(req, 'error', 'Cannot chat with yourself!');
                    res.redirect('/');
                } else {

                    let thread = await Thread.find({users: {$all: [currentlyLoggedInUser, otherUser]}});

                    if (thread.length === 0) {
                        let threadObj = {
                            users: [currentlyLoggedInUser, otherUser],
                            dateCreated: Date.now()
                        };
                        thread = await Thread.create(threadObj);
                    }

                    req.user.otherUsers.push(user._id);
                    req.user.save().then(() => {
                    });

                    res.redirect(`/thread/${user.username}`)
                }
            }
        } catch (err) {
            console.log(err);
            flashMessages(req, 'error', err);
            res.redirect('/');
        }
    }
};
