import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const Project = mongoose.model("Project", projectSchema)

export default Project