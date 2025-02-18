CREATE TABLE "detail_penjualan" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "detail_penjualan_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"detailID" integer NOT NULL,
	"produkID" integer NOT NULL,
	"jumlahProduk" integer NOT NULL,
	"subTotal" numeric(10, 6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pelanggan" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pelanggan_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nama" varchar(255) NOT NULL,
	"alamat" text NOT NULL,
	"noTelp" varchar(13) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "penjualan" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "penjualan_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tanggalPenjualan" date NOT NULL,
	"totalHarga" numeric(10, 6) NOT NULL,
	"pelanganID" integer NOT NULL,
	"userID" integer NOT NULL
); 
--> statement-breakpoint
CREATE TABLE "products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"namaProduk" varchar(255) NOT NULL,
	"hargaProduk" numeric(10, 6) NOT NULL,
	"stock" integer NOT NULL
);
