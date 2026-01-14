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
      collection(db, "users", user.uid, "subjects", subject.id, "tasks"),
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
      collection(db, "users", user.uid, "subjects", subject.id, "tasks"),
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
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow text-center">
        Select a subject
      </div>
    );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow h-full flex flex-col">
      <div className="p-5 border-b">
        <h2 className="font-semibold">
          Tasks – <span className="text-indigo-600">{subject.name}</span>
        </h2>

        <div className="grid gap-2 mt-3">
          <input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task title"
            className="p-2 rounded border"
          />
          <input
            type="number"
            value={estimated}
            onChange={(e) => setEstimated(e.target.value)}
            placeholder="Estimated minutes"
            className="p-2 rounded border"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="p-2 rounded border"
          />
          <button
            onClick={addTask}
            className="bg-indigo-600 text-white py-2 rounded cursor-pointer"
          >
            Add Task
          </button>
        </div>
      </div>

      <ul className="p-4 space-y-3 overflow-y-auto">
        {tasks.map((task) => {
          const progress = Math.min(
            100,
            Math.round(
              (task.spentMinutes /
                (task.spentMinutes + task.estimatedMinutes || 1)) *
                100
            )
          );

          return (
            <li
              key={task.id}
              onClick={() => onSelectTask(task)}
              className={`p-4 rounded border cursor-pointer ${
                task.completed ? "bg-green-100" : "hover:bg-indigo-50"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs">
                    {task.spentMinutes} /{" "}
                    {task.spentMinutes + task.estimatedMinutes} min
                  </p>
                </div>

                {task.completed && (
                  <FiCheckCircle className="text-green-600 text-xl" />
                )}
              </div>

              <div className="h-1 bg-gray-200 mt-2">
                <div
                  className="h-1 bg-indigo-600"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComplete(task);
                }}
                className="text-xs underline mt-1 cursor-pointer"
              >
                {task.completed ? "Undo" : "Mark done"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tasks;
