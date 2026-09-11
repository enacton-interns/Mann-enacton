import { configureStore } from "@reduxjs/toolkit";
import JournalMoodReducer from "./features/JournalMoodSlice";

export const store = configureStore({
  reducer: JournalMoodReducer,
});
