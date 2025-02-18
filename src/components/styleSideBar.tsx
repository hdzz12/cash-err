"use client";

import React, { useState } from "react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

const MenuItem = ({ text, href }: { text: string, href: string }) => (
  <li>
    <Link href={href} className="flex items-center p-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-all duration-200">
      <span className="font-medium">{text}</span>
    </Link>
  </li>
);

const StyleSideBar = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
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
    <div className="h-screen w-72 bg-white flex flex-col shadow-sm border-r border-gray-100 fixed top-0 left-0 z-10">
      <div className="p-6">
        <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Daster Bordir Cantik
        </span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          <MenuItem text="Beranda" href="/dashboard/beranda" />
          <MenuItem text="Manajemen Pengguna" href="/dashboard/manajemen" />
          <MenuItem text="Data Member" href="/dashboard/member" />
          <MenuItem text="Data Produk" href="/dashboard/" />
          <MenuItem text="Transaksi" href="/dashboard/transaksi" />
          <MenuItem text="Riwayat" href="/dashboard/riwayat" />
        </ul>
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="w-full p-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
        >
          Logout
        </button>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-gray-700 hover:bg-red-600 transition-colors"
              onClick={() => {
                logout.mutate();
                setShowLogoutDialog(false);
              }}
            >
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StyleSideBar;
