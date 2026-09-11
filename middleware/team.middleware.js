import Team from "../models/team.model.js";

const isTeamMember = async(req,res,next) => {
    try {
        const userId = req.user.id;
        const teamId = req.params.teamId;

        //if(!teamId) return res.status(400).json({message : "Team not found"})

        const findTeam = await Team.findById(teamId)

        if(!findTeam) return res.status(400).json({message : "Team not found"})

        if(findTeam.members.includes(userId) || findTeam.owner == userId) {
            req.team = findTeam;
            next();
        }
        else return res.status(400).json({message : "User not authorized"})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message : "Internal server error"})
    }
}

export default isTeamMember;