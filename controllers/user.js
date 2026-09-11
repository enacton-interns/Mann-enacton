import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

export const handleRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let role = req.body.role;

    // Prevent users from self-assigning admin role
    if (!role || !['customer', 'provider'].includes(role)) {
        role = "customer"
    }
    
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedpassword, role });

    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid password" });
    }
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await Session.create({
      userId: user._id,
      sessionId: sessionId,
      expiresAt,
    });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" },
    );

    const refreshToken = jwt.sign(
      { sessionId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json({ success: true, accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const handleLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, error: "Refresh token missing" });
    }
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    await Session.deleteOne({
      sessionId: decodedToken.sessionId,
    });

    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    res.clearCookie("refreshToken");
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const handleRefresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, error: "Refresh token missing" });
    }

    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    
    const session = await Session.findOne({
      sessionId: decodedToken.sessionId,
    });

    if (!session) {
      return res
        .status(404)
        .json({ success: false, error: "Session not found" });
    }

    const user = await User.findById(session.userId).select("role -_id")
    
    const newAccessToken = jwt.sign(
      { id: session.userId, role : user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" },
    );

    return res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const handleGetProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};