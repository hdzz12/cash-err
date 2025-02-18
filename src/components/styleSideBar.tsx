"use client";

import React from "react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const MenuItem = ({ text, href }: { text: string, href: string }) => (
  <li>
    <Link href={href} className="flex items-center p-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-all duration-200">
      <span className="font-medium">{text}</span>
    </Link>
  </li>
);

const StyleSideBar = () => {
  const session = api.session.read.useQuery(undefined, {
    retry: false,
    staleTime: 1 * 60 * 1000,
    refetchInterval: 1 * 60 * 1000
  });
  const logout = api.session.delete.useMutation({
    onSuccess: () => {
      window.location.href = "/";
      toast.success("Logged out successfully");
    }
  });

  if (session.isError) {
    window.location.href = "/";
    toast.error("You are not logged in");
  }

  return (
    <div className="h-screen w-72 bg-white flex flex-col shadow-sm border-r border-gray-100">
      <div className="p-6">
        <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Cash-Er
        </span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          <MenuItem text="Beranda" href="/dashboard/beranda" />
          <MenuItem text="Manajemen Pengguna" href="/dashboard/manajemen" />
          <MenuItem text="Transaksi" href="/dashboard/transaksi" />
          <MenuItem text="Riwayat" href="/dashboard/riwayat" />
        </ul>
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={() => {
            logout.mutate();
          }}
          className="w-full p-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all duration-200 font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default StyleSideBar;
