import fs from "fs"
import generatePDF from "../utils/generatepdf.js";
import { createObjectCsvWriter } from "csv-writer";
import TimeTrack from "../models/timetrack.js";
import Project from "../models/project.js"
import path from "path"

export const handleGetAllTimeTracks = async (req,res) => {
    try {
        const {projectId} = req.params
        const timeTracks = await TimeTrack.find({userId: req.user.id, projectId: projectId}).populate("projectId")
        if(!timeTracks) {
            return res.status(404).json({
                success: false,
                message: "No time tracks found"
            })
        }
        return res.status(200).json({
            success: true,
            timeTracks
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const handleCreateTimeTrackForProject = async(req,res) => {
    try {
        const {projectId} = req.params
        let {date} = req.body
        const {hours, description} = req.body
        if(!date){
            date = Date.now()
        }
        else{
            date = new Date(date)
        }
        if(!hours || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const timeTrack = await TimeTrack.create({userId: req.user.id, projectId: projectId, hours, description, date})
        return res.status(201).json({
            success: true,
            timeTrack
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const handleDeleteTimeTrack = async (req,res) => {
    try{
        const {projectId, timeId} = req.params;
        await TimeTrack.findByIdAndDelete({_id : timeId, userId: req.user.id, projectId : projectId});
        return res.status(200).json({
            success: true,
            message: "Time track deleted successfully"
        })
    } catch(error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const handleUpdateTimeTrack = async (req, res) => {
    try{
        const {projectId, timeId} = req.params;
        const {hours, description} = req.body;
        if(!hours || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const timeTrack = await TimeTrack.findOneAndUpdate({_id : timeId, userId: req.user.id, projectId : projectId}, {hours, description}, {returnDocument: "after"});
        if(!timeTrack){
            return res.status(404).json({
                success: false,
                message: "Time track not found"
            })
        }
        return res.status(200).json({
            success: true,
            timeTrack
        })
    } catch(error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const handleExportTimeTrackOfProject = async (req, res) => {
    try{
        const {type} = req.body;
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        const timeTracks = await TimeTrack.find({userId: req.user.id, projectId: projectId});
        
        if(!timeTracks) {
            return res.status(404).json({
                success: false,
                message: "No time tracks found"
            })
        }

        let filename = `${project.name}-Timetracks-${new Date().toISOString().split("T")[0]}`;
        if(type == "csv"){
            filename += ".csv"
            const csv = createObjectCsvWriter({
                path : `./exports/${filename}`,
                header : [
                    {id: "_id", title: "ID"},
                    {id: "description", title: "Description"},
                    {id: "date", title : "Date"},
                    {id: "hours", title: "Hours"}
                ]
            })
            await csv.writeRecords(timeTracks)
        }
        else if(type == "pdf"){
            filename += ".pdf";
            const pdfData = timeTracks.map((track) => ({
              _id: track._id?.toString(),
              description: track.description,
              date: track.date?.toISOString().split("T")[0],
              hours: track.hours,
            }));
            
            await generatePDF(
                [{ label: "ID", property: "_id" },
                  { label: "Description", property: "description" },
                  { label: "Date", property: "date" },
                  { label: "Hours", property: "hours" }],
              pdfData,
              `./exports/${filename}`,
            );
        }
        return res.sendFile(path.join(process.cwd(), "exports", filename));
    } catch(error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const handleSummaryOfProject = async(req,res) => {
    
}