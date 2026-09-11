import { createSlice, nanoid } from "@reduxjs/toolkit";

const savedData = localStorage.getItem("journalmood");
const parsedData = savedData ? JSON.parse(savedData) : null;

const initialState = {
  // Providing static data at start
  Journal: parsedData?.Journal || [
    {
      "id": 1,
      "category": "Grateful",
      "text": "<p>Had a productive day and finished my tasks on time.</p>",
      "createdAt": "2026-06-22"
    },
    {
      "id": 2,
      "category": "Achievement",
      "text": "<p>Learned about React hooks and state management.</p>",
      "createdAt": "2026-06-21"
    },
    {
      "id": 3,
      "category": "Reflection",
      "text": "<p>Need to spend less time scrolling and more time coding.</p>",
      "createdAt": "2026-06-20"
    },
    {
      "id": 4,
      "category": "Grateful",
      "text": "<p>Enjoyed a nice conversation with a friend today.</p>",
      "createdAt": "2026-06-19"
    },
    {
      "id": 5,
      "category": "Challenge",
      "text": "<p>Got stuck on a bug but eventually figured it out.</p>",
      "createdAt": "2026-06-18"
    },
    {
      "id": 6,
      "category": "Reflection",
      "text": "<p>Consistency matters more than motivation.</p>",
      "createdAt": "2026-06-17"
    },
    {
      "id": 7,
      "category": "Goal",
      "text": "<p>Plan to complete a TypeScript mini project this week.</p>",
      "createdAt": "2026-06-16"
    }
  ],
  Mood: parsedData?.Mood || [
    {
      "id": 1,
      "emoji": "😟",
      "addedAt": "2026-06-22T09:15:00.000Z"
    },
    {
      "id": 2,
      "emoji": "😊",
      "addedAt": "2026-06-21T18:30:00.000Z"
    },
    {
      "id": 3,
      "emoji": "😎",
      "addedAt": "2026-06-20T14:45:00.000Z"
    },
    {
      "id": 4,
      "emoji": "😴",
      "addedAt": "2026-06-19T22:10:00.000Z"
    },
    {
      "id": 5,
      "emoji": "🤩",
      "addedAt": "2026-06-18T11:25:00.000Z"
    },
    {
      "id": 6,
      "emoji": "😌",
      "addedAt": "2026-06-17T19:05:00.000Z"
    },
    {
      "id": 7,
      "emoji": "😁",
      "addedAt": "2026-06-16T08:40:00.000Z"
    }
  ],
  activities: parsedData?.activities || [
    {
      id: 1,
      type: "journal_added",
      message: "Added a new journal entry",
      timestamp: "2026-06-22T12:30:00Z"
    },
    {
      id: 2,
      type: "mood_added",
      message: "Logged mood as Happy",
      timestamp: "2026-06-22T14:00:00Z"
    }
  ],
  FavoriteQuotes: parsedData?.FavoriteQuotes || [],
  selectedDate: new Date().toISOString().split("T")[0],
  theme: parsedData?.theme || "light",
};

const JournalMoodSlice = createSlice({
  name: "JournalMood",
  initialState,
  reducers: {
    newJournal: (state, action) => {
      state.Journal.push({
        id: nanoid(),
        category: action.payload.category,
        text: action.payload.text,
        createdAt: new Date().toISOString().split("T")[0],
      });

      localStorage.setItem("journalmood", JSON.stringify(state));
    },

    deleteJournal: (state, action) => {
      state.Journal = state.Journal.filter((j) => j.id !== action.payload);
      localStorage.setItem("journalmood", JSON.stringify(state));
    },

    editJournal: (state, action) => {
      state.Journal = state.Journal.map((j) =>
        j.id == action.payload.id
          ? {
              ...action.payload,
              createdAt: new Date().toISOString().split("T")[0],
            }
          : j,
      );
      localStorage.setItem("journalmood", JSON.stringify(state));
    },

    toggleFavoriteQuote: (state, action) => {
      const quote = action.payload; // { id, quote, author }
      const index = state.FavoriteQuotes.findIndex(
        (q) => q.quote === quote.quote,
      );
      if (index >= 0) {
        state.FavoriteQuotes = state.FavoriteQuotes.filter(
          (q) => q.quote !== quote.quote,
        );
      } else {
        state.FavoriteQuotes.unshift(quote);
      }
      localStorage.setItem("journalmood", JSON.stringify(state));
    },

    changeSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
      localStorage.setItem("journalmood", JSON.stringify(state));
    },

    newMood: (state, action) => {
      state.Mood.push({
        id: nanoid(),
        emoji: action.payload.emoji,
        addedAt: action.payload.addedAt,
      });

      localStorage.setItem("journalmood", JSON.stringify(state));
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("journalmood", JSON.stringify(state));
    },
    deleteMood: (state, action) => {
      state.Mood = state.Mood.filter((mood) => mood.id !== action.payload);
      localStorage.setItem("journalmood", JSON.stringify(state));
    },
    addActivity: (state, action) => {
      state.activities.unshift({
        id: nanoid(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      });

      // keep latest 20
      if (state.activities.length > 5) {
        state.activities.pop();
      }
      localStorage.setItem("journalmood", JSON.stringify(state));
    },
  },
});

export const {
  newJournal,
  deleteJournal,
  editJournal,
  toggleFavoriteQuote,
  changeSelectedDate,
  newMood,
  toggleTheme,
  deleteMood,
  addActivity,
} = JournalMoodSlice.actions;

export default JournalMoodSlice.reducer;
