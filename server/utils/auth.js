//DECLARATIONS: webtoken -----------
const jwt = require('jsonwebtoken');

const secret = 'mysecretshhhh';
const expiration = '2h';

//EXPORTS ====================

module.exports = {
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload }, secret, { expiresIn: expiration});
    }
};