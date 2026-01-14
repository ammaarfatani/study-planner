import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { FiLogIn } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
          <FiLogIn className="text-indigo-600 text-3xl" />
          <h2 className="text-2xl font-bold dark:text-white">Welcome Back</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
            Login
          </button>
        </form>

        <button
          onClick={handleGoogle}
          className="w-full mt-4 border py-3 rounded-lg"
        >
          Login with Google
        </button>

        <p className="text-center text-sm text-slate-500 mt-4">
          Don’t have an account? <a href="/signup" className="text-indigo-600">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
