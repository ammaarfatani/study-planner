import Header from "../components/Header";
import { FiBook, FiClock, FiBarChart2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import Subjects from "../components/Subjects";
import Tasks from "../components/Tasks";
import FocusTimer from "../components/FocusTimer";
import Analytics from "../components/Analytics";
import SessionHistory from "../components/SessionHistory";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import MotivationalQuote from "../components/MotivationalQuote";

const Dashboard = ({ user }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [subjectCount, setSubjectCount] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [completion, setCompletion] = useState(0);

  // 📘 Subjects count
  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      collection(db, "users", user.uid, "subjects"),
      (snap) => setSubjectCount(snap.size)
    );
  }, [user]);

  // ⏱ Today focus
  useEffect(() => {
    if (!user) return;

    const today = new Date().toLocaleDateString();
    return onSnapshot(
      collection(db, "users", user.uid, "sessions"),
      (snap) => {
        let total = 0;
        snap.docs.forEach((doc) => {
          const d = doc.data();
          if (!d.completedAt || !d.duration || d.status === "reset") return;
          if (d.completedAt.toDate().toLocaleDateString() === today) {
            total += d.duration;
          }
        });
        setTodayMinutes(total);
      }
    );
  }, [user]);

  // ✅ Task completion %
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(
      collection(db, "users", user.uid, "subjects"),
      async (snap) => {
        let total = 0;
        let done = 0;

        for (const sub of snap.docs) {
          const tasksSnap = await getDocs(
            collection(db, "users", user.uid, "subjects", sub.id, "tasks")
          );
          tasksSnap.docs.forEach((t) => {
            total++;
            if (t.data().completed) done++;
          });
        }

        setCompletion(total ? Math.round((done / total) * 100) : 0);
      }
    );

    return () => unsub();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white">
      <Header />

      <main className="max-w-7xl mx-auto p-6 space-y-6">
<MotivationalQuote />
        {/* 📊 STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={<FiBook />} label="Subjects" value={subjectCount} />
          <StatCard
            icon={<FiClock />}
            label="Focus Today"
            value={`${(todayMinutes / 60).toFixed(1)}h`}
          />
          <StatCard
            icon={<FiBarChart2 />}
            label="Task Completion"
            value={`${completion}%`}
          />
        </div>

        {/* 🧠 MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="max-h-[420px] overflow-y-auto rounded-xl">
  <Subjects onSelect={setSelectedSubject} user={user} />
</div>


              {/* SCROLLABLE TASKS */}
              <div className="max-h-[420px] overflow-y-auto rounded-xl">
                <Tasks
                  subject={selectedSubject}
                  onSelectTask={setSelectedTask}
                />
              </div>
            </div>

            <div className="max-h-[350px] overflow-y-auto">
              <Analytics user={user} />
            </div>

            {/* <div className="max-h-[300px] overflow-y-auto">
              <SessionHistory user={user} />
            </div> */}
          </div>

          <div className="sticky top-24 h-fit">
            <FocusTimer task={selectedTask} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow flex items-center gap-4">
    <div className="text-indigo-600 text-3xl">{icon}</div>
    <div>
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);
