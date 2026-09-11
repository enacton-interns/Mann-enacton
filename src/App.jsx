import AddJournal from "./Components/AddJournal";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./Components/Layout";
import Quotes from "./Components/Quotes";
import Home from "./Components/Home";
import Calendar from "./Components/Calendar";
import Moods from "./Components/Moods";
import AllJournals from "./Components/AllJournals";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ViewJournal from "./Components/ViewJournal";

function App() {
  const theme = useSelector((state) => state.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "journals",
          element: <AllJournals />,
        },
        {
          path: "journals/:id",
          element: <ViewJournal />,
        },
        {
          path: "addjournal",
          element: <AddJournal />,
          children: [
            {
              path: ":id",
              element: <AddJournal />,
            },
          ],
        },
        {
          path: "moods",
          element: <Moods />,
        },
        {
          path: "quotes",
          element: <Quotes />,
        },
        {
          path: "calendar",
          element: <Calendar />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
