import mongoose from "mongoose"

const RecurringBookingSchema = new mongoose.Schema(
    {
        serviceId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        userId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        frequency : {
            type : String,
            required : true,
            enum : ["daily", "weekly", "monthly"]
        },
        interval : {
            type : Number,
            required : true,
            min : 1
        },
        startDate : {
            type: Date,
            required: true,
        },
        endDate : {
            type : Date,
            required : true
        },
        nextRunAt : {
            type : Date,
            required : true
        },
        isActive :{
            type : Boolean,
            default : true
        }
    }
)

const RecurringBooking = mongoose.model("RecurringBooking", RecurringBookingSchema);

export default RecurringBooking;