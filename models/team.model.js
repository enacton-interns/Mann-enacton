import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", TeamSchema);
export default Team
