import jwt from 'jsonwebtoken';

export const verifyCustomer = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token", error: err.message });
        }

        req.user = decoded; // فيه: name, email, userId, role
        next();
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

export const verifyChefToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token", error: err.message });
      }

      if (decoded.role !== "chef") {
        return res.status(403).json({ message: "Access Denied: Only chefs can access this route" });
      }

      req.user = decoded; // فيه: name, email, userId, role
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
