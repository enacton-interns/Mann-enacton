import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { moodScaleData } from "../Data/mood";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

export const MoodLineChart = () => {
  const moods = useSelector((state) => state.Mood);
  const selectedDate = useSelector((state) => state.selectedDate);
  const theme = useSelector((state) => state.theme);

  const isDark = theme === "dark";

  const filtered = moods
    .filter((m) => m.addedAt?.split("T")[0] === selectedDate)
    .sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));

  // const averageMood = Math.round(moods.reduce((acc, mood) => {
  //   const value = moodScaleData[mood.emoji] || 0;
  //   return acc + value;
  // }, 0) / moods.length);
  // console.log(averageMood);

  const gridColor  = isDark ? "rgba(63, 63, 70, 0.6)" : "rgba(203, 213, 225, 0.5)";
  const tickColor  = isDark ? "#94a3b8" : "#64748b";
  const titleColor = isDark ? "#cbd5e1" : "#475569";

  const data = {
    labels: filtered.map((m) => {
      const date = new Date(m.addedAt);
      return date.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      });
    }),
    datasets: [
      {
        label: "Mood Trend",
        data: filtered.map((m) => moodScaleData[m.emoji] || 0),
        borderColor: "#10b981",
        backgroundColor: isDark
          ? "rgba(16, 185, 129, 0.12)"
          : "rgba(16, 185, 129, 0.15)",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "#10b981",
        pointBorderColor: isDark ? "#18181b" : "#ffffff",
        pointBorderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: tickColor,
          font: { family: "Inter, sans-serif", size: 12 },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#27272a" : "#ffffff",
        titleColor: isDark ? "#e2e8f0" : "#1e293b",
        bodyColor: isDark ? "#94a3b8" : "#475569",
        borderColor: isDark ? "#3f3f46" : "#e2e8f0",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          color: tickColor,
          font: { family: "Inter, sans-serif", size: 13 },
          callback: (val) => {
            const labels = { 1: "😢", 2: "😕", 3: "😐", 4: "😊", 5: "😁" };
            return labels[val] ?? val;
          },
        },
        grid: { color: gridColor },
        title: {
          display: true,
          text: "Mood Intensity",
          color: titleColor,
          font: { family: "Inter, sans-serif", size: 12 },
        },
      },
      x: {
        ticks: {
          color: tickColor,
          font: {
            family: "Inter, sans-serif",
            size: 9,
          },
          autoSkip: true,
          maxTicksLimit: 4,
          maxRotation: 0,
          minRotation: 0,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};
