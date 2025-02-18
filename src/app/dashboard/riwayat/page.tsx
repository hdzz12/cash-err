"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function RiwayatPage() {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchDate, setSearchDate] = useState("");

  const { data: transactions } = api.transaction.list.useQuery();
  const { data: selectedTransaction } = api.transaction.getById.useQuery(
    { id: selectedId! },
    { enabled: !!selectedId }
  );

  const handleViewDetail = (id: number) => {
    setSelectedId(id);
    setDetailOpen(true);
  };

  const filteredTransactions = searchDate
    ? transactions?.filter(t =>
      format(new Date(t.tanggalPenjualan), "yyyy-MM-dd") === searchDate
    )
    : transactions;

  return (
    <div className="p-8 bg-gray-50 min-h-screen pl-80">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Riwayat Transaksi</h1>
        <Input
          type="date"
          value={searchDate}
          onChange={e => setSearchDate(e.target.value)}
          className="w-48"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>ID Transaksi</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Kasir</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions?.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.tanggalPenjualan), "dd MMMM yyyy, HH:mm", { locale: id })}
                </TableCell>
                <TableCell>
                  #
                  {String(transaction.id).padStart(4, "0")}
                </TableCell>
                <TableCell>{transaction.pelanggan.nama}</TableCell>
                <TableCell>
                  Rp
                  {Number(transaction.totalHarga).toLocaleString()}
                </TableCell>
                <TableCell>{transaction.user.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetail(transaction.id)}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID Transaksi</p>
                  <p className="font-medium">
                    #
                    {String(selectedTransaction.id).padStart(4, "0")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal</p>
                  <p className="font-medium">
                    {format(new Date(selectedTransaction.tanggalPenjualan), "dd MMMM yyyy, HH:mm", { locale: id })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pelanggan</p>
                  <p className="font-medium">{selectedTransaction.pelanggan.nama}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kasir</p>
                  <p className="font-medium">{selectedTransaction.user.name}</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTransaction.details.map(detail => (
                    <TableRow key={detail.id}>
                      <TableCell>{detail.product.namaProduk}</TableCell>
                      <TableCell>
                        Rp
                        {Number(detail.product.hargaProduk).toLocaleString()}
                      </TableCell>
                      <TableCell>{detail.jumlahProduk}</TableCell>
                      <TableCell>
                        Rp
                        {Number(detail.subTotal).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">
                      Total
                    </TableCell>
                    <TableCell className="font-bold">
                      Rp
                      {" "}
                      {Number(selectedTransaction.totalHarga).toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right">
                      Bayar
                    </TableCell>
                    <TableCell>
                      Rp
                      {" "}
                      {Number(selectedTransaction.totalBayar).toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right">
                      Kembalian
                    </TableCell>
                    <TableCell>
                      Rp
                      {" "}
                      {Number(selectedTransaction.kembalian).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="flex justify-end">
                <Button onClick={() => window.print()}>Cetak</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
