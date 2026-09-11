import Team from "../models/team.model.js";
import User from "../models/user.model.js";

export const handleGetTeams = async (req,res) => {
    try {
        const userId = req.user.id;
        const findTeam = await Team.find({
            $or : [
                {owner: userId},
                {members: {$in: [userId]}}
            ]
        });

        if(!findTeam) return res.status(400).json({message : "Team not found"})
        
        return res.status(200).json({success : true, findTeam})
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message : "Internal server error"})
    }
}

export const handleCreateTeam = async (req,res) => {
    try{
        const {name} = req.body;
        const owner = req.user.id;

        if(!name) return res.status(400).json({message : "Team name is required"})

        const team = await Team.create({name,owner, members: [owner]})
        return res.status(201).json({success : true, team, message : "Team created successfully"})
        
    } catch(error) {
        console.log(error.message)
        return res.status(500).json({message : "Internal server error"})
    }
}

export const handleInviteMember = async (req, res) => {
    const { userId } = req.body;
    const findTeam = req.team;

    if(!findTeam) return res.status(400).json({message : "Team not found"})

    if(!findTeam.members.includes(userId)) {
        findTeam.members.push(userId)
        await findTeam.save()
    }
    return res.status(200).json({success : true, findTeam, message : "Member invited successfully"})
}

export const handleRemoveMember = async (req,res) => {
    const {userId} = req.body;
    const findTeam = req.team;

    if (!findTeam) return res.status(400).json({ message: "Team not found" });
    if (!findTeam.members.includes(userId)) return res.status(400).json({message : "User not found"})
    
    findTeam.members = findTeam.members.filter((member) => member.toString() !== userId);
    await findTeam.save();

    return res.status(200).json({success : true, findTeam, message : "Member removed successfully"})
}

export const handleViewTeam = async (req,res) => {
    try {
        const team = req.team;

        const owner = await User.findById(team.owner).select("-password")
        const members = await User.find({_id : {$in : team.members}}, "-password")

        return res.status(200).json({success : true, team, owner, members})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message : "Internal server error"})
    }
}