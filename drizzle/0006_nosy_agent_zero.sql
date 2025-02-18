ALTER TABLE "penjualan" ALTER COLUMN "tanggalPenjualan" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "penjualan" ALTER COLUMN "tanggalPenjualan" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "penjualan" ALTER COLUMN "totalHarga" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "penjualan" ADD COLUMN "metodePembayaran" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "penjualan" ADD COLUMN "totalBayar" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "penjualan" ADD COLUMN "kembalian" numeric(10, 2) NOT NULL;