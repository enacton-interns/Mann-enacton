import Booking from "../models/Booking.js"
import ServiceProvider from "../models/ServiceProvider.js";

export const handleCreateBookingOfCustomer = async (req, res) => {
  try {
    const { serviceId, bookingDate } = req.body;
    const userId = req.user.id;

    const booking = new Booking({
      serviceId,
      userId,
      bookingDate,
      status: "pending",
    });

    await booking.save();

    return res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleGetAllBookingOfCustomer = async (req, res) => {
    try {
        const bookings = await Booking.find({
            userId: req.user.id
        }).populate("serviceId", "name").populate("providerId", "name")

        if(!bookings.length){
            return res.status(404).json({
                success: false,
                error: "No bookings found, please create a booking first.",
            })
        }

        return res.status(200).json({success : true, bookings})
        
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        error: error.message,
      })
    }
};

export const handleCancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params
        const userId = req.user.id

        const booking = await Booking.findOne({
            _id: bookingId,
            userId: userId,
        })

        if(!booking){
            return res.status(404).json({
                success: false,
                error: "Booking does not exist",
            })
        }

        if(booking.status !== "pending"){
            return res.status(400).json({
                success: false,
                message: "Booking cannot be cancelled as it is already accepted, rejected or completed",
            })
        }

        await Booking.findByIdAndDelete(bookingId)

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
        })
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({success : false, error : error.message})
    }
}

export const handleGetBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("serviceId", "name")
      .populate("userId", "name")
      .populate("providerId", "name");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    return res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ success: false, error: error.message });
  }
};


export const handleAcceptOrRejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    const serviceProvider = await ServiceProvider.findOne({ userId });

    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        error: "Provider not found",
      });
    }

    const booking = await Booking.findOneAndUpdate(
      {
        _id: bookingId,
        status: "pending",
      },
      {
        $set: {
          status: "accepted",
          providerId: serviceProvider._id,
        },
      },
      {
        returnDocument: "after",
      },
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleGetActiveBooking = async (req, res) => {
    try {
        const userId = req.user.id
        const role = req.user.role;
        const condition = {}

        if(role === "customer") {
            condition.userId = userId;
        } else if(role === "provider"){
            const serviceProvider = await ServiceProvider.findOne({ userId })
            if(!serviceProvider){
                return res.status(404).json({
                    success: false,
                    error: "Provider profile not found",
                })
            }
            condition.providerId = serviceProvider._id;
        }
        
        const bookings = await Booking.find({...condition, status: "pending"})
            .populate("serviceId", "name")
            .populate("userId", "name")
            .populate("providerId", "name")

        return res.status(200).json({
            success: true,
            bookings,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, error: error.message })
    }
}

