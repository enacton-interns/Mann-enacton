import RecurringBooking from "../models/RecurringBooking.js";

export const handleGetAllRecurringBooking = async (req, res) => {
  try {
    const userId = req.user.id
    
    const recurringBookings = await RecurringBooking.find({userId}).populate("serviceId", "name")
    
    return res.status(200).json({
        success: true,
        recurringBookings,
    })
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const handleCreateRecurringBooking = async (req, res) => {
    try {
      const userId = req.user.id;
      const {
        serviceId,
        startDate,
        endDate,
        frequency,
        interval,
      } = req.body;

      const frequencyMap = {
        daily: 1,
        weekly: 7,
        monthly: 30,
      };
      if (!frequencyMap[frequency]) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid frequency" });
      }
      
      let start = new Date(startDate);
      const nextRunAt = new Date(
        start.getTime() +
        frequencyMap[frequency] * interval * 24 * 60 * 60 * 1000,
      );
      console.log(nextRunAt);

      const recurringBooking = new RecurringBooking({
        serviceId,
        userId,
        frequency,
        interval,
        startDate,
        endDate,
        nextRunAt,
      });

      await recurringBooking.save();

      return res
        .status(201)
        .json({
          success: true,
          message: "Recurring booking created successfully",
        });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
};

export const handleUpdateRecurringBooking = async(req,res) => {
    try {
        const {id} = req.params
        const {
          
        } = req.body
        
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({success : false, error: error.message})
    }
}

export const handleDeleteRecurringBooking = async(req,res) => {
    try {
        const id = req.params.id
        const userId = req.user.id
        const recurringBooking = await RecurringBooking.findOne({_id: id, userId})

        if(!recurringBooking){
            return res.status(404).json({success : false, error: "Recurring booking not found"})
        }

        await recurringBooking.deleteOne()
        return res.status(200).json({success : true, message: "Recurring booking deleted successfully"})
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({success : false, error: error.message})
    }
}