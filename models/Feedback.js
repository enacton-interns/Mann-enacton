import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {timestamps: true},
)

const Feedback = mongoose.model("Feedback", FeedbackSchema)

export default Feedback