"use client";

import { api } from "@/trpc/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatRupiah } from "@/lib/utils/format";

export default function Dashboard() {
  const { data: user } = api.session.read.useQuery();
  const { data: stats, isLoading } = api.dashboard.stats.useQuery();

  if (isLoading) return <div>Loading...</div>;

  const statCards = [
    {
      title: "Total Transaksi",
      value: stats?.totalTransactions ?? 0,
      format: (val: number) => val.toString()
    },
    {
      title: "Total Pendapatan",
      value: stats?.totalRevenue ?? 0,
      format: formatRupiah
    },
    {
      title: "Total Pelanggan",
      value: stats?.totalCustomers ?? 0,
      format: (val: number) => val.toString()
    },
    {
      title: "Total Produk",
      value: stats?.totalProducts ?? 0,
      format: (val: number) => val.toString()
    },
    {
      title: "Total Stok",
      value: stats?.totalStock ?? 0,
      format: (val: number) => val.toString()
    },
    {
      title: "Total Pengguna",
      value: stats?.totalUsers ?? 0,
      format: (val: number) => val.toString()
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen pl-80">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Selamat datang,
          {user?.name}
          !
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-800">
                {stat.format(stat.value)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions & Low Stock Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaksi Terbaru</h3>
          <div className="space-y-4">
            {stats?.recentTransactions.map(transaction => (
              <div key={transaction.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800">
                      {transaction.pelanggan.nama}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(transaction.tanggalPenjualan), "dd MMMM yyyy, HH:mm", { locale: id })}
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium text-pink-600 bg-pink-100 rounded-full">
                    {formatRupiah(Number(transaction.totalHarga))}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {transaction.details.map(detail => (
                    <div key={detail.id} className="flex justify-between">
                      <span>
                        {detail.product.namaProduk}
                        {" "}
                        x
                        {" "}
                        {detail.jumlahProduk}
                      </span>
                      <span>{formatRupiah(Number(detail.subTotal))}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Stok Produk</h3>
          <div className="space-y-4">
            {stats?.lowStockProducts.map(product => (
              <div key={product.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{product.namaProduk}</p>
                  <p className="text-sm text-gray-500">{formatRupiah(Number(product.hargaProduk))}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  product.stock <= 5 ? "text-red-600 bg-red-100" : "text-yellow-600 bg-yellow-100"
                }`}
                >
                  Stok:
                  {" "}
                  {product.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
