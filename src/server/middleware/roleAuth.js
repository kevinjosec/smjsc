const authorizeAdmin = (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (user.role !== "headmaster") {
    return res.status(403).json({ message: "Access denied. Headmaster only" });
  }
  next(); // Only proceed if the user is "headmaster"
};

module.exports = authorizeAdmin;
