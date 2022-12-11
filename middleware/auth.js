const jwt = require("jsonwebtoken");

// middleware for autherization
exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

  // if there is no token
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token does not exist",
    });
  }

  // decoding the token
  const verifiedToken = jwt.verify(token, process.env.TOKEN_KEY);
  if (!verifiedToken) {
    return res.status(400).json({
      success: false,
      message: "Invalid token",
    });
  } else {
    // if verifed successfully
    res.status(200).json({
      success: true,
      message: "Token verifed successfully",
      id: verifiedToken.id,
      email: verifiedToken.email,
    });
      
      next();
  }
  } catch (error) {
      res.status(400).json({
          success: false,
          error
    })
  }
};
