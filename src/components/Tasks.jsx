import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { FiCheckCircle } from "react-icons/fi";

const Tasks = ({ subject, onSelectTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [estimated, setEstimated] = useState("");
  const [tasks, setTasks] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    if (!subject || !user) return;

    return onSnapshot(
      collection(
        db,
        "users",
        user.uid,
        "subjects",
        subject.id,
        "tasks"
      ),
      (snap) =>
        setTasks(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            subjectId: subject.id,
          }))
        )
    );
  }, [subject, user]);

  const addTask = async () => {
    if (!taskTitle || !deadline || !estimated)
      return alert("All fields required");

    await addDoc(
      collection(
        db,
        "users",
        user.uid,
        "subjects",
        subject.id,
        "tasks"
      ),
      {
        title: taskTitle,
        deadline,
        estimatedMinutes: Number(estimated),
        spentMinutes: 0,
        completed: false,
        createdAt: serverTimestamp(),
      }
    );

    setTaskTitle("");
    setDeadline("");
    setEstimated("");
  };

  const toggleComplete = async (task) => {
    await updateDoc(
      doc(
        db,
        "users",
        user.uid,
        "subjects",
        subject.id,
        "tasks",
        task.id
      ),
      { completed: !task.completed }
    );
  };

  if (!subject)
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow text-center text-slate-500">
        Select a subject to view tasks
      </div>
    );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow h-full flex flex-col">

      {/* HEADER */}
      <div className="p-5 border-b dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
        <h2 className="font-semibold">
          Tasks – <span className="text-indigo-600">{subject.name}</span>
        </h2>

        {/* ADD TASK */}
        <div className="grid grid-cols-1 gap-2 mt-3">
          <input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task title"
            className="p-2 rounded-lg border text-sm dark:bg-slate-700"
          />
          <input
            type="number"
            value={estimated}
            onChange={(e) => setEstimated(e.target.value)}
            placeholder="Estimated minutes"
            className="p-2 rounded-lg border text-sm dark:bg-slate-700"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="p-2 rounded-lg border text-sm dark:bg-slate-700"
          />
          <button
            onClick={addTask}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* TASK LIST */}
      <ul className="p-4 space-y-3 overflow-y-auto">
        {tasks.map((task) => {
          const progress = Math.min(
            100,
            Math.round(
              (task.spentMinutes / task.estimatedMinutes) * 100
            )
          );

          return (
            <li
              key={task.id}
              onClick={() => onSelectTask(task)}
              className={`p-4 rounded-xl border cursor-pointer transition
                ${
                  task.completed
                    ? "bg-green-50 dark:bg-green-900/30 border-green-400"
                    : "hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700"
                }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-slate-500">
                    {task.spentMinutes}/{task.estimatedMinutes} min
                  </p>
                </div>

                {task.completed && (
                  <FiCheckCircle className="text-green-600 text-lg" />
                )}
              </div>

              {/* Progress */}
              <div className="h-1 bg-slate-200 rounded mt-2">
                <div
                  className="h-1 bg-indigo-600 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>📅 {task.deadline}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(task);
                  }}
                  className="underline"
                >
                  {task.completed ? "Undo" : "Mark done"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tasks;
