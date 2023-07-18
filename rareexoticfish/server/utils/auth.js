const JsonWebTokens = require('jsonwebtoken');

const secret = 'ricardoevan';
const expiration = '2h';

module.exports = {
   authmiddleware: function ({ request }) {
        let token = req.body.token || req.query.token || req.headers.authorization;
        
        if (req.headers.aithorization) {
            token = token.spilt(' ').pop().trim();
        }
        
        if (!token) {
            return request;
        };
        
        try {
            const {data} = JsonWebTokens.verify(token, secret, { maxAge: expiration });
            request.user = data;
        } catch (err) {
            console.log ('Invalid token/Authorization Error! :', err);
        };

        return request;
    },
    signToken: function ({ firstName, lastName, email, _id, adminAccess = false }) {
        const payload = { firstName, lastName, email, _id, adminAccess };

        return JsonWebTokens.sign({ data: payload }, secret, { expiresIn: expiration });
    },
};
