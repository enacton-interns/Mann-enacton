import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sessionId : {
        type: String,
        required: true
    },
    expiresAt : {
        type : Date,
        required : true,
        expires : 0
    }
})

const Session = mongoose.model("session", SessionSchema)

export default Session