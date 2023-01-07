//DECLARATIONS: webtoken -----------
const jwt = require('jsonwebtoken');

const secret = 'mysecretshhhh';
const expiration = '2h';

//EXPORTS ====================

module.exports = {
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload }, secret, { expiresIn: expiration});
    },
    authMiddleware: function({ req }) {
        //let token come from req.body,req.query, or header
        let token = req.body.token || req.query.token || req.headers.authorization;

        //need to remove bearer from tokenvalue
        if (req.headers.authorization) {
            token = token  
                .split(' ')
                .pop()
                .trim();
        }
        //if no token just return req
        if (!token) {
            return req;
        }

        try {
            //decode token + attatch to req
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('Invalid token');
        }

        return req;
    }
};