"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Marked as async to use await inside
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/register", {
        name,
        email,
        password,
      });

      alert("Registration successful!");
      router.push("/login"); // Redirect to login page
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Name:
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </label>

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

        <label>
          Confirm Password:
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
