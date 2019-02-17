const DB = require("../db");

const sessionMiddleware = (req, res, next) => {
  const resetPassword = (req.originalUrl === '/users/me/reset_password') ? true : false;
  const sessionId = req.headers.authorization;

  if (!sessionId) {
    return res.status(401).json({ error: "No session ID provided" });
  }

  const queryString = (!resetPassword) ?
    "SELECT users.* FROM users INNER JOIN sessions ON sessions.user_id = users.id WHERE sessions.session_id = ?" :
    "SELECT users.* FROM users WHERE users.email = ?";
  const searchString = (!resetPassword) ? sessionId : req.body.email;

  DB.get( queryString, searchString)
  .then(user => {
    if (!user) {
      return res
        .status(401)
        .json({ error: "Session ID does not match any valid sessions" });
    }

    req.user = user;
    next();
  });
};

module.exports = { sessionMiddleware };
