import cron from "node-cron";
import { processRecurringBookings } from "../workers/recurringbooking.js";

export const startBookingCron = () => {
  cron.schedule("0 0 * * *", async () => {
    await processRecurringBookings();
  });

  console.log("Recurring booking cron started");
};
