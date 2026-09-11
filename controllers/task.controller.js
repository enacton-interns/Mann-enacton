import Task from "../models/task.model.js";
import User from "../models/user.model.js";

export const handleGetTasks = async (req,res) => {
    try {
        const teamId = req.team.id;

        const tasks = await Task.find({team : teamId})
        if (!tasks) return res.status(400).json({message : "No tasks found"})
        
        return res.status(200).json({success : true, tasks})
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message : "Internal server error"})
    }
}

export const handleCreateTask = async (req,res) => {
    try{
        const {title, description, assignedTo} = req.body;
        const teamId = req.team.id;

        if (!title || !description) return res.status(400).json({message : "Title and description are required"})

        const findMember = await User.findById(assignedTo);
        
        if(!findMember) return res.status(400).json({message : "User not found"})

        const task = await Task.create({
            title,
            description,
            assignedTo,
            team: teamId,
            createdBy: req.user.id
        })

        return res.status(201).json({success : true, task, message : "Task created successfully"})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message : "Internal server error"})
    }
}

export const handleDeleteTask = async (req,res) => {
    try {
        const taskId = req.params.taskId;
        const teamId = req.team.id;

        const task = await Task.findById(taskId);
        if (!task) return res.status(400).json({message : "Task not found"})
        if (task.team.toString() != teamId.toString()) return res.status(400).json({message : "Task not found"})

        if(req.user.role != "admin" && task.assignedTo.toString() != req.user.id.toString()) {
            return res.status(400).json({message : "User is not authorized to delete the task"})
        }

        await Task.findByIdAndDelete(taskId);
        return res.status(200).json({success : true, message : "Task deleted successfully"})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message : "Internal server error"})
    }
}

export const handleUpdateTask = async (req,res) => {
    try{
        const taskId = req.params.taskId;
        const teamId = req.team.id;

        const {title, description, assignedTo, status} = req.body;

        const task = await Task.findById(taskId)
        
        if(task.assignedTo.toString() != req.user.id.toString()) {
            return res.status(400).json({message : "You are not authorized to update the task"})
        }
        if(!task) return res.status(400).json({message : "Task not found"})
        if(task.team.toString() != teamId.toString()) return res.status(400).json({message : "Team not found"})

        if(title) task.title = title;
        if(description) task.description = description;
        if(assignedTo) {
            const findMember = await User.findById(assignedTo);
            if(!findMember) return res.status(400).json({message : "User not found"})
            task.assignedTo = assignedTo;
        }
        if(status != undefined) task.status = status;

        await task.save();
        return res.status(200).json({success : true, task, message : "Task updated successfully"})

    }catch(error){
        console.log(error.message);
        return res.status(500).json({message : "Internal server error"})
    }
}

export const handleGetSingleTask = async (req,res) => {
    try{
        const taskId = req.params.taskId;
        const teamId = req.team.id;

        const task = await Task.findById(taskId);
        if (!task) return res.status(400).json({message : "Task not found"})
        if(task.team.toString() != teamId.toString()) return res.status(400).json({message : "Task not found"})

        return res.status(200).json({success : true, task})

    }catch(error){
        console.log(error.message);
        return res.status(500).json({message : "Internal server error"})
    }
}