import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
  };

  const username = user?.email
    ? user.email.split("@")[0]
    : "User";

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LEFT */}
        <div>
          <h1 className="text-2xl font-bold text-indigo-600">
            Study Planner
          </h1>
          <p className="text-xs text-slate-500">
            Focus • Track • Improve
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold uppercase">
            {username.charAt(0)}
          </div>

          {/* Username */}
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {username}
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
