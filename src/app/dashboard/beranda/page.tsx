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
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Selamat datang, {user?.name}!</p>
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
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-4 text-sm font-medium ${activeTab === "products" ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-500"}`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-6 py-4 text-sm font-medium ${activeTab === "transactions" ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-500"}`}
            >
              Transactions
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
              <div className="space-y-4">
                {stats?.recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {transaction.pelanggan.nama}
                        {" "}
                        -
                        {formatRupiah(Number(transaction.totalHarga))}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(transaction.tanggalPenjualan), "dd MMMM yyyy, HH:mm", { locale: id })}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium text-pink-600 bg-pink-100 rounded-full">
                      {transaction.user.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[1, 2, 3].map(i => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #
                        {1000 + i}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        User
                        {i}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Admin</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-600 hover:text-pink-800">
                        <button>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add more tab contents as needed */}
        </div>
      </div>
    </div>
  );
}
