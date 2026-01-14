import { useEffect, useRef, useState } from "react";
import { db, auth } from "../firebase";
import { doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";

const FocusTimer = ({ task }) => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!task) return;

    setSeconds(task.estimatedMinutes * 60);
    setRunning(false);
    clearInterval(intervalRef.current);
    startTimeRef.current = null;
  }, [task]);

  const start = () => {
    if (!task) return alert("Select a task first");

    startTimeRef.current = Date.now();
    setRunning(true);

    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          finish(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const pause = () => finish(false);

  const finish = async (completed) => {
    clearInterval(intervalRef.current);
    setRunning(false);

    if (!startTimeRef.current || !task) return;

    const diffMin = Math.floor(
      (Date.now() - startTimeRef.current) / 60000
    );

    startTimeRef.current = null;

    if (diffMin < 1) return;

    const remaining = task.estimatedMinutes - diffMin;

    await updateDoc(
      doc(
        db,
        "users",
        auth.currentUser.uid,
        "subjects",
        task.subjectId,
        "tasks",
        task.id
      ),
      {
        spentMinutes: task.spentMinutes + diffMin,
        estimatedMinutes: Math.max(0, remaining),
        completed: completed || remaining <= 0,
      }
    );

    await addDoc(
      collection(db, "users", auth.currentUser.uid, "sessions"),
      {
        taskId: task.id,
        duration: diffMin,
        completed,
        createdAt: serverTimestamp(),
      }
    );

    if (completed || remaining <= 0) {
      alert("🎉 Mubarak ho! Aap ne task complete kar liya!");
    }
  };

  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");

  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h2 className="font-semibold mb-2">⏱ Focus Timer</h2>
      <p className="text-sm mb-2">{task?.title || "Select a task"}</p>

      <div className="text-4xl font-bold mb-4">
        {min}:{sec}
      </div>

      {!running ? (
        <button
          onClick={start}
          className="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Start
        </button>
      ) : (
        <button
          onClick={pause}
          className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Pause
        </button>
      )}
    </div>
  );
};

export default FocusTimer;
