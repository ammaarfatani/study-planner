import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const SessionHistory = ({ user }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "sessions"),
      orderBy("completedAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setSessions(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4">🕘 Session History</h2>

      {sessions.length === 0 ? (
        <p className="text-sm text-slate-500">No sessions yet</p>
      ) : (
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="flex justify-between items-center text-sm p-2 rounded
              bg-slate-100 dark:bg-slate-700"
            >
              <div>
                <p className="font-medium">{s.subjectName}</p>
                <p className="text-xs text-slate-500">
                  {s.status}
                </p>
              </div>
              <span>{s.duration} min</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SessionHistory;
