/**
 * Created by Hristo Skipernov on 13/10/2017.
 */

module.exports = (req, type, message) => {
    req.session.sessionFlash = {
        type: type,
        message: message
    };
};