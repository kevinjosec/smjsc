const authorizeAdmin = (req, res, next) => {
  const user = req.user;

  if (user.role !== "headmaster") {
    return res.status(403).json({ message: "Access denied. Headmaster only" });
  }
  next(); // Only proceed if the user is "headmaster"
};

module.exports = authorizeAdmin;