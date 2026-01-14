import { useEffect, useRef, useState } from "react";
import { db, auth } from "../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

const FocusTimer = ({ task }) => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // ✅ TASK CHANGE → TIMER RESET WITH TASK TIME
  useEffect(() => {
    if (!task) return;

   const mins = Number(task.estimatedMinutes || 25);

    setSeconds(mins * 60);
    setRunning(false);

    clearInterval(intervalRef.current);
    startTimeRef.current = null;
  }, [task]);

  const start = () => {
    if (!task || !auth.currentUser) {
      alert("Select a task first");
      return;
    }

    startTimeRef.current = Date.now();
    setRunning(true);

    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          finish("completed");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const pause = () => finish("paused");
  const reset = () => finish("reset");

  const finish = async (status) => {
    clearInterval(intervalRef.current);
    setRunning(false);

    if (!startTimeRef.current || !task) {
      return;
    }

    const diffMin = Math.floor(
      (Date.now() - startTimeRef.current) / 60000
    );

    startTimeRef.current = null;

    if (diffMin < 1) return;

    await addDoc(
      collection(db, "users", auth.currentUser.uid, "sessions"),
      {
        taskId: task.id,
        taskName: task.title,
        subjectId: task.subjectId,
        subjectName: task.subjectName,
        duration: diffMin,
        status,
        completedAt: serverTimestamp(),
      }
    );
  };

  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow text-center">
      <h2 className="font-semibold mb-2">⏱ Focus Timer</h2>

      <p className="text-sm text-slate-500 mb-2">
        Task: {task?.title || "Select a task"}
      </p>

      <div className="text-4xl font-bold mb-4">
        {min}:{sec}
      </div>

      <div className="space-x-2">
        {!running ? (
          <button
            onClick={start}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pause}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Pause
          </button>
        )}

        <button
          onClick={reset}
          className="bg-slate-300 px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;
