"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";

export default function Login() {
  const login = api.session.create.useMutation({
    onSuccess: (data) => {
      toast.success(`logged in as ${data.name}`);
      window.location.href = "/dashboard/beranda";
    },
    onError: (error) => {
      toast.error(error.message);
    }
  }
  );

  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    login.mutate({ username, password });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-white to-pink-200">
      <div className="max-w-md w-full p-10 shadow-lg rounded-lg bg-white">
        <h1 className="text-center mb-6 text-gray-800 text-2xl font-semibold">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block mb-2 text-gray-600">Nama Pengguna</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setusername(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 text-gray-800"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-gray-600">Kata Sandi</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 text-gray-800"
              required
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="w-1/2 p-3 rounded-lg bg-pink-500 text-white text-lg font-semibold hover:bg-pink-600 transition duration-300">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
