const JsonWebTokens = require('jsonwebtoken');

const secret = 'ricardoevan';
const expiration = '2h';

module.exports = {
   authMiddleware: function ({ req }) {
        let token = req.body.token || req.query.token || req.headers.authorization;
        
        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }
        
        if (!token) {
            return req;
        }
        
        try {
            const {data} = JsonWebTokens.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch (err) {
            console.log ('Invalid token/Authorization Error! :', err);
        };

        return req;
    },
    signToken: function ({ firstName, lastName, email, _id, adminAccess = false }) {
        const payload = { firstName, lastName, email, _id, adminAccess };

        return JsonWebTokens.sign({ data: payload }, secret, { expiresIn: expiration });
    },
};
