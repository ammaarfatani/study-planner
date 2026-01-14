import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FiPlus, FiBookOpen } from "react-icons/fi";

const Subjects = ({ onSelect }) => {
  const [subjectName, setSubjectName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      collection(db, "users", user.uid, "subjects"),
      (snap) =>
        setSubjects(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        )
    );
  }, [user]);

  const addSubject = async () => {
    if (!subjectName.trim() || !user) return;

    await addDoc(
      collection(db, "users", user.uid, "subjects"),
      {
        name: subjectName.trim(),
        createdAt: serverTimestamp(),
      }
    );
    setSubjectName("");
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow flex flex-col h-full">

      <div className="p-5 border-b dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
        <h2 className="font-semibold flex items-center gap-2">
          <FiBookOpen className="text-indigo-600" />
          Subjects
        </h2>

        <div className="flex gap-2 mt-3">
          <input
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Add new subject"
            className="flex-1 px-3 py-2 rounded-lg border text-sm dark:bg-slate-700"
          />
          <button
            onClick={addSubject}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 rounded-lg cursor-pointer"
          >
            <FiPlus />
          </button>
        </div>
      </div>

      <ul className="p-4 space-y-2 overflow-y-auto">
        {subjects.length === 0 && (
          <p className="text-sm text-slate-500 text-center">
            No subjects yet
          </p>
        )}

        {subjects.map((subj) => (
          <li
            key={subj.id}
            onClick={() => onSelect(subj)}
            className="p-3 rounded-lg cursor-pointer border
              hover:border-indigo-500
              hover:bg-indigo-50 dark:hover:bg-slate-700
              transition"
          >
            <p className="font-medium">{subj.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subjects;
