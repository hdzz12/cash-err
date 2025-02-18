import { db } from "./index";
import { products } from "./schema";

async function main() {
  try {
    const testProducts = [
      {
        namaProduk: "Kaos Hitam",
        hargaProduk: 50000,
        stock: 10
      },
      {
        namaProduk: "Celana Jeans",
        hargaProduk: 150000,
        stock: 5
      },
      {
        namaProduk: "Kemeja Putih",
        hargaProduk: 100000,
        stock: 8
      }
    ];

    console.log("Menambahkan data test...");

    for (const product of testProducts) {
      await db.insert(products).values(product);
    }

    console.log("Data test berhasil ditambahkan!");
  }
  catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main().catch(console.error);
