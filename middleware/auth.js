import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Access token missing",
      });
    }

    const accessToken = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );

    req.user = decodedToken;

    next();
  } catch (error) {
    console.log(error.message);

    return res.status(401).json({
      success: false,
      error: "Invalid or expired access token",
    });
  }
};

export default auth;