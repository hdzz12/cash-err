import { db } from "./index";
import { products } from "./schema";
import { sql } from "drizzle-orm";

const dummyProducts = [
  {
    namaProduk: "Kaos Basic Hitam",
    hargaProduk: 99000,
    stock: 50,
    imageUrl: "https://i.imgur.com/jEGhqEz.jpg"
  },
  {
    namaProduk: "Celana Cargo",
    hargaProduk: 199000,
    stock: 30,
    imageUrl: "https://i.imgur.com/xDjYdVx.jpg"
  },
  {
    namaProduk: "Hoodie Abu-abu",
    hargaProduk: 249000,
    stock: 25,
    imageUrl: "https://i.imgur.com/L5IQmbe.jpg"
  }
];

async function main() {
  try {
    // Hapus semua data produk yang ada
    await db.delete(products);
    console.log("Data produk lama dihapus");

    // Masukkan data baru satu per satu
    for (const product of dummyProducts) {
      await db.insert(products).values(product);
      console.log(`Berhasil menambah: ${product.namaProduk}`);
    }

    // Cek jumlah produk yang berhasil ditambahkan
    const count = await db.select({ count: sql`count(*)::int` }).from(products);
    console.log(`Total produk sekarang: ${count[0]?.count ?? 0}`);

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

main();
