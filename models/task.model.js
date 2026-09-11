import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title : {
        required : true,
        type : String
    },
    description : {
        type : String
    },
    team : {
        required : true,
        type : mongoose.Schema.Types.ObjectId,
        ref : "Team"
    },
    assignedTo : {
        required : true,
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    createdBy : {
        required : true,
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    status : {
        type : String,
        enum : ['Pending', 'In Progress', 'Completed'],
        default : 'Pending'
    }
}, {timestamps : true})

const Task = mongoose.model("Task", TaskSchema);
export default Task;