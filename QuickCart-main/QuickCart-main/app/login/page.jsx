"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAppContext();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      alert("Login successful!");
      router.push("/"); // redirect to homepage
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:3001/api/google-login", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      alert("Google login successful!");
      router.push("/");
    } catch (error) {
      alert("Google login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <label>
          Email:
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer hover:underline"
          onClick={() => router.push("/register")}
        >
          Register here
        </span>
      </p>

      {/* 👇 Google Sign-In Button */}
      <div className="mt-6 text-center">
        <p className="mb-2">Or login with</p>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => alert("Google login failed")}
        />
      </div>
    </div>
  );
};

export default LoginPage;
