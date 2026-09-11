import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: false
    },
    bookingDate : {
      type: Date,
      required: true,
    },
    recurringBookingId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecurringBooking",
      required : false
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;