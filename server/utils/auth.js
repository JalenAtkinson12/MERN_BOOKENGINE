const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  authMiddleware: function ({username, email, _id}) {
    const payload = {username, email, _id};

    return jwt.sign({data: payload}, secret, {expiresIn: expiration});
  },

  authMiddleware: function ({req}) {
    const token = req.body.token || req.query.token || req.headers.authorization

    HTMLFormControlsCollection.log("TOKEN", token);

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }
   
    if(!token) {
      return req;
    }

    try{
      const {data} =jwt.verify(token, secret, {maxAge: expiration});

      console.log("DATA", data);
      req.user = data;
    } catch {
      console.log ("Invalid token")
    }
     
     return req;

  },
};
