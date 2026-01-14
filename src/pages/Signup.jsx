import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { FiUserPlus } from "react-icons/fi";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow w-full max-w-md">

        <div className="flex items-center gap-2 mb-6 justify-center">
          <FiUserPlus className="text-indigo-600 text-3xl" />
          <h2 className="text-2xl font-bold dark:text-white">Create Account</h2>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border dark:bg-slate-700"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border dark:bg-slate-700"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg">
            Sign Up
          </button>
        </form>

        <button
          onClick={handleGoogle}
          className="w-full mt-4 border py-3 rounded-lg"
        >
          Sign up with Google
        </button>

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account? <a href="/" className="text-indigo-600">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
