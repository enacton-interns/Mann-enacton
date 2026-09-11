import User from "../models/user.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const handleRegister = async (req,res) => {
    try {
        const {name, email, password} = req.body
        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await User.create({name, email, password: hashedPassword})

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user : {
                id : user._id,
                name : user.name,
                email : user.email,
                createdAt : user.createdAt,
                updatedAt : user.updatedAt
            }
        })
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const handleLogin = async (req,res) => {
    try{
        const {email, password} = req.body
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({email})
        if(!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET, {expiresIn: "1d"})
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          maxAge: 86400000,
          sameSite: "strict",
        })

        return res.status(200).json({
          success: true,
          message: "User logged in successfully",
          token,
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            createdAt: existingUser.createdAt,
            updatedAt: existingUser.updatedAt,
          },
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const handleLogout = async (req,res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const handleGetProfile = async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const handleGetUserById = async(req,res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id).select("-password")
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}