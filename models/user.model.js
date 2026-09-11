import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name : {
        required : true,
        type : String
    },
    email : {
        required : true,
        type : String,
        unique : true
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    password : {
        required : true,
        type : String
    }
}, {timestamps : true})

const User = mongoose.model('User', UserSchema)
export default User