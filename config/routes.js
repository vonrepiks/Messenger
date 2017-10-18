const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {

    app.get('/', controllers.home.get);

    //User requests
    app.get('/user/register', controllers.user.register.get);
    app.post('/user/register', controllers.user.register.post);
    app.get('/user/login', controllers.user.login.get);
    app.post('/user/login', controllers.user.login.post);
    app.post('/user/logout', controllers.user.logout);
    app.get('/user/find', restrictedPages.isAuthed, controllers.user.find);

    //Thread requests
    app.get('/thread/:username', restrictedPages.isAuthed, controllers.thread.getChatRoom);
    app.post('/thread/:username', restrictedPages.isAuthed, controllers.thread.postChatRoom);

    //Unhandled requests
    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
    })
};
