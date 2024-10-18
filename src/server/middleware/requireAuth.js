const jwt = require("jsonwebtoken");
const User = require("../models/users");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  console.log("Authorization : " ,authorization);

  if (!authorization) {
    return res.status(401).json({ error: "Authorization required" });
  }

  const token = authorization.split(" ")[1];
  console.log("token : ", token)

  try {
    const { _id } = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Access denied" });
  }
};


module.exports = requireAuth;