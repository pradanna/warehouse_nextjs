"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { baseUrl } from "../config/config";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(baseUrl + "/login", {
        username,
        password,
      });

      const { access_token } = response.data.data;

      localStorage.setItem("access_token", access_token);
      toast.success("Login berhasil!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error("Login gagal. Username atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Soft white wave background */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-white to-gray-100 rounded-b-[50%] -z-10"></div>

      <div className="flex w-[90%] max-w-4xl shadow-2xl rounded-lg overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-6">Sign in</h2>

          <p className="text-sm text-center text-gray-500 ">
            Let’s get you signed in
          </p>
          <p className="text-sm text-center text-gray-500 mb-6">
            enter your username and password.
          </p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Username"
                required
              />
            </div>

            <div className="mb-4">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Password"
                required
              />
            </div>

            <p className="text-sm text-right text-gray-500 mb-4 cursor-pointer hover:underline">
              Forgot your password?
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-4 rounded-full hover:bg-orange-600 transition"
            >
              {loading ? "Loading..." : "SIGN IN"}
            </button>
          </form>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-gradient-to-tr from-pink-500 to-red-400 text-white p-10 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-4">Hi, Welcome Back!</h2>
          <p className="text-sm text-center mb-6 text-gray-100">
            Login and take control of your warehouse!
          </p>
        </div>
      </div>
    </div>
  );
}
