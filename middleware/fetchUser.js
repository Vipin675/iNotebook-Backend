const jwt = require("jsonwebtoken");
const JWT_TOKEN = "this_is_my_JWT_TOKEN";

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).json({ error: "Please authenticate using a valid token." });
  }

  try {
    const data = jwt.verify(token, JWT_TOKEN);
    req.user = data;

    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate using a valid token." });
  }
};

module.exports = fetchUser;
