"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils/format";
import Image from "next/image";
import { LoadingState } from "@/components/loading-state";

interface Product {
  id: number
  namaProduk: string
  hargaProduk: number
  stock: number
  imageUrl: string
}

interface CartItem extends Product {
  quantity: number
}

export default function TransaksiPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const utils = api.useContext();
  const { data: products } = api.product.list.useQuery();
  const { data: dailyStats } = api.transaction.getDailyStats.useQuery(undefined, {
    refetchInterval: 5000,
    initialData: {
      totalTransactions: 0,
      totalRevenue: 0
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const { mutate: createTransaction } = api.transaction.create.useMutation({
    onSuccess: () => {
      toast.success("Transaksi berhasil!");
      // Refresh semua data terkait
      utils.transaction.getDailyStats.invalidate();
      utils.transaction.list.invalidate();
      utils.product.list.invalidate();

      // Reset form
      setCart([]);
      setCustomerName("");
      setPaymentAmount("");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const handlePrintReceipt = async (transactionId: number) => {
    try {
      const transaction = await api.transaction.getById.query({ id: transactionId });
      // Implement receipt printing logic here
      // Could open in new window or use a receipt printing library
    }
    catch (error) {
      console.error("Failed to print receipt:", error);
    }
  };

  const filteredProducts = products?.filter(product =>
    product.namaProduk.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function handlers
  const addToCart = (product: Product) => {
    if (product.stock < 1) {
      toast.error("Stok habis");
      return;
    }

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error("Stok tidak mencukupi");
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    }
    else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    const product = products?.find(p => p.id === id);
    if (!product || quantity > product.stock) {
      toast.error("Stok tidak mencukupi");
      return;
    }
    if (quantity < 1) return;

    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.hargaProduk * item.quantity), 0);
  };

  const getChange = () => {
    const total = getTotal();
    const payment = parseFloat(paymentAmount) || 0;
    return payment - total;
  };

  const handleCheckout = () => {
    if (!customerName) {
      toast.error("Nama pelanggan harus diisi");
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) < getTotal()) {
      toast.error("Pembayaran kurang");
      return;
    }

    if (cart.length === 0) {
      toast.error("Keranjang kosong");
      return;
    }

    try {
      const transactionData = {
        customerName,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          subTotal: item.hargaProduk * item.quantity
        })),
        totalAmount: getTotal(),
        paymentAmount: parseFloat(paymentAmount)
      };

      createTransaction(transactionData);
    }
    catch (error) {
      console.error("Checkout error:", error);
      toast.error("Gagal memproses transaksi");
    }
  };

  if (isLoading) {
    return <LoadingState title="Memuat transaksi..." skeletonCount={6} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen pl-80">
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Transaksi Hari Ini</h3>
          <p className="text-2xl font-bold">{dailyStats.totalTransactions}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Pendapatan Hari Ini</h3>
          <p className="text-2xl font-bold">
            {formatRupiah(dailyStats.totalRevenue)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product List Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Daftar Produk</h2>
          <Input
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts?.map(product => (
              <Card
                key={product.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => addToCart(product)}
              >
                <div className="relative aspect-square">
                  <Image
                    src={product.imageUrl}
                    alt={product.namaProduk}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{product.namaProduk}</h3>
                  <p className="text-sm text-gray-600">{formatRupiah(product.hargaProduk)}</p>
                  <p className="text-sm text-gray-500">
                    Stok:
                    {product.stock}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart & Payment Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Detail Transaksi</h2>
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <Input
              placeholder="Nama Pelanggan"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="mb-4"
            />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.namaProduk}</TableCell>
                    <TableCell>
                      {formatRupiah(item.hargaProduk)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatRupiah(item.hargaProduk * item.quantity)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>
                  {formatRupiah(getTotal())}
                </span>
              </div>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Jumlah Bayar"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                />
                <Button onClick={handleCheckout}>Bayar</Button>
              </div>
              {parseFloat(paymentAmount) > 0 && (
                <div className="flex justify-between font-semibold">
                  <span>Kembalian:</span>
                  <span>
                    {formatRupiah(getChange())}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
