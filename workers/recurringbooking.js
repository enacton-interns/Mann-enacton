import Booking from "../models/Booking.js";
import RecurringBooking from "../models/RecurringBooking.js";

const frequencyMap = {
  daily: 1,
  weekly: 7,
  monthly: 30,
};

export const processRecurringBookings = async () => {
  try {
    console.log("Checking recurring bookings...");

    const recurringBookings = await RecurringBooking.find({
      isActive: true,
      nextRunAt: { $lte: new Date() },
    });

    console.log(`Found ${recurringBookings.length} recurring bookings to process`);

    for (const recurring of recurringBookings) {
      // Create booking

      await Booking.create({
        serviceId: recurring.serviceId,
        userId: recurring.userId,
        status: "pending",
        bookingDate : recurring.nextRunAt,
        recurringBookingId: recurring._id,
      });

      console.log(`Booking created for recurring booking ${recurring._id}`);

      // Calculate next run

      const nextRunAt = new Date(
        recurring.nextRunAt.getTime() +
          frequencyMap[recurring.frequency] * recurring.interval * 24 * 60 * 60 * 1000,
      );

      // Stop if exceeded end date

      if (nextRunAt > recurring.endDate) {
        recurring.isActive = false;
        await recurring.save();
        console.log(`Recurring booking ${recurring._id} completed`);
        continue;
      }

      recurring.nextRunAt = nextRunAt;

      await recurring.save();
    }
  } catch (error) {
    console.error("Recurring booking worker error:", error);
  }
};
