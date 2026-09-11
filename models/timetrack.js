import mongoose from "mongoose";

const timeTrackSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    hours : Number,
    description : String,
    date : {
        type : Date,
        default : Date.now()
    }
}, {timestamps: true})

const TimeTrack = mongoose.model("TimeTrack", timeTrackSchema)

export default TimeTrack