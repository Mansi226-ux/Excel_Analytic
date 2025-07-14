const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
  } catch (error) {
    console.error("Authorization Error:", error.message);
    return res
      .status(500)
      .json({ error: "Server error during authorization." });
  }
};

module.exports = isAdmin;
