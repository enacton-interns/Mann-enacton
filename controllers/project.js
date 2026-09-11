import Project from "../models/project.js"

export const handleGetAllProjects = async (req,res) => {
    try{
        const projects = await Project.find({userId: req.user.id})
        if(!projects) {
            return res.status(404).json({
                success: false,
                message: "No projects found"
            })
        }
        return res.status(200).json({
            success: true,
            projects
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

export const handleCreateProject = async (req,res) => {
    try {
        const {name, description} = req.body
        if(!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const project = await Project.create({name, description, userId: req.user.id})
        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const handleDeleteProject = async (req,res) => {
    try{
        const {id} = req.params
        const project = await Project.findById(id)
        if(!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            })
        }
        await Project.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

export const handleUpdateProject = async (req,res) => {
    try{
        const {id} = req.params
        const {name, description} = req.body
        const project = await Project.findById(id)
        if(!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            })
        }
        const updatedProject = await Project.findByIdAndUpdate(id, {name, description}, {returnDocument: 'after'})
        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            updatedProject
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}