import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const handleRegister = async (req,res) => {
    try {
        const {name, email, password, role} = req.body;

        const findUser = await User.findOne({email});

        if(findUser) {
            return res.status(400).json({message : "User already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        await User.create({
            name,
            email,
            password : hashedPassword,
            role
        })
        
        return res.status(201).json({message : "User created successfully"})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message : "Internal server error"})
    }
}

export const handleLogin = async (req,res) => {
    try {
        const {email,password} = req.body;

        const findUser = await User.findOne({email})

        if(!findUser) {
            return res.status(400).json({message : "User not found"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const isMatch = await bcrypt.compare(password, hashedPassword)

        if (!isMatch) {
            return res.status(400).json({message : "Invalid credentials"})
        }

        const token = jwt.sign({
            id : findUser._id,
            role : findUser.role
        }, process.env.JWT_SECRET)

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 // 1 hour
        })

        return res.status(200).json({
          success: true,
          message: "Logged in successfully!",
          token
        });

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message : "Internal server error"})
    }
}

export const handleGetProfile = async (req,res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password -_id");

        if(!user) {
            return res.status(400).json({message : "User not found"})
        }

        return res.status(200).json({success : true, user})
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message : "Internal server error"})
    }
}

export const handleLogout = async (req,res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if(!user) {
        return res.status(400).json({message : "User not found"})
    }

    res.clearCookie("token")

    return res.status(200).json({success : true, message : "Logged out successfully"})
}