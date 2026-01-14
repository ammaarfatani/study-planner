import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const user = auth.currentUser;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setShowLogoutConfirm(false);
  };

  const username = user?.email
    ? user.email.split("@")[0]
    : "User";

  return (
    <>
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold text-indigo-600">
            Study Planner
          </h1>
          <p className="text-xs text-slate-500">
            Focus • Track • Improve
          </p>
        </div>

        <div className="flex items-center gap-4">

          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold uppercase">
            {username.charAt(0)}
          </div>

          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {username}
          </span>

          <button
             onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition cursor-pointer"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>
    </header>
    {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-2">
              Confirm Logout
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded border cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
