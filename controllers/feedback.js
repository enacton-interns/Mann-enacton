import Feedback from "../models/Feedback.js"
import Booking from "../models/Booking.js"

export const handleCreateFeedback = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { rating, comment } = req.body
        const userId = req.user.id;

        // Business logic: booking must exist and be completed
        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ success: false, error: "Booking not found" })
        }

        if(booking.status !== "completed") {
            return res.status(403).json({ success: false, error: "Booking must be completed to give feedback" })
        }

        if(booking.userId.toString() !==  userId) {            
            return res.status(403).json({ success: false, error: "You can only give feedback for your own bookings" })
        }
        
        const feedback = await Feedback.create({ bookingId, rating, comment })
        return res.status(201).json({ success: true, feedback })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: error.message })
    }
}

export const handleGetAllFeedback = async (req, res) => {
    try{
        const userId = req.user.id;
        const booking = await Booking.find({userId}).select("_id")
        const feedback = await Feedback.find({bookingId : {
            $in : booking
        }})

        if (!feedback.length) {
            return res.status(404).json({ success: false, error: "Feedback not found" })
        }
        return res.status(200).json({ success: true, feedback })
    } catch (error) {
        console.error(error)
        return res.status(500).json({success : false, error : error.message})
    }
}

export const handleGetFeedback = async (req, res) => {
    try{
        const { bookingId } = req.params
        const userId = req.user.id

        const booking = await Booking.findById(bookingId);
        if (!booking) {
          return res
            .status(404)
            .json({ success: false, error: "Booking not found" });
        }

        if (booking.userId.toString() !== userId) {
          return res
            .status(403)
            .json({
              success: false,
              error: "You can only give feedback for your own bookings",
            });
        }

        const feedback = await Feedback.findOne({ bookingId })

        if (!feedback) {
            return res.status(404).json({
                success : false,
                error : "Feedback not found"
            })
        }

        return res.status(200).json({
            success : true,
            feedback
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success : false,
            error : error.message
        })
    }
}