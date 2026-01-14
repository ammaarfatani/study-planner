import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const formatDate = (d) =>
  d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

const getWeekLabel = (date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  return `Week of ${formatDate(start)}`;
};

const Analytics = ({ user }) => {
  const [daily, setDaily] = useState({});
  const [weekly, setWeekly] = useState({});

  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "sessions");

    const unsub = onSnapshot(ref, (snap) => {
      const dayMap = {};
      const weekMap = {};

      snap.docs.forEach((doc) => {
        const d = doc.data();

        if (!d.completedAt || !d.duration || d.status === "reset") return;

        const date = d.completedAt.toDate();
        const dayKey = formatDate(date);
        const weekKey = getWeekLabel(date);

        dayMap[dayKey] = (dayMap[dayKey] || 0) + d.duration;
        weekMap[weekKey] = (weekMap[weekKey] || 0) + d.duration;
      });

      setDaily(dayMap);
      setWeekly(weekMap);
    });

    return () => unsub();
  }, [user]);

  const makeChart = (label, data) => ({
    labels: Object.keys(data),
    datasets: [
      {
        label,
        data: Object.values(data),
        backgroundColor: "#6366f1",
        borderRadius: 6,
      },
    ],
  });

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow space-y-6">
      <h2 className="font-semibold text-lg">📊 Performance Analytics</h2>

      {Object.keys(daily).length === 0 ? (
        <p className="text-sm text-slate-500">No focus data yet</p>
      ) : (
        <>
          <div>
            <h3 className="text-sm font-medium mb-2">
              Daily Focus (minutes)
            </h3>
            <div className="h-[260px]">
              <Bar data={makeChart("Daily Focus", daily)} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">
              Weekly Focus (minutes)
            </h3>
            <div className="h-[260px]">
              <Bar data={makeChart("Weekly Focus", weekly)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
