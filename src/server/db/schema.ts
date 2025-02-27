// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { date, decimal, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const userLevels = pgEnum("user_levels", ["admin", "user"]);

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  name: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 50 }).notNull(),
  password: varchar().notNull(),
  level: userLevels().notNull().default("user"),
  passwordUpdatedAt: timestamp({ withTimezone: true })

});
export const usersSchema = createSelectSchema(users);

export const penjualan = pgTable("penjualan", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  tanggalPenjualan: timestamp({ withTimezone: true }).defaultNow().notNull(),
  totalHarga: decimal({ precision: 10, scale: 2 }).notNull(),
  pelanganID: integer().notNull(),
  userID: integer().notNull(),
  metodePembayaran: varchar({ length: 50 }).notNull(),
  totalBayar: decimal({ precision: 10, scale: 2 }).notNull(),
  kembalian: decimal({ precision: 10, scale: 2 }).notNull()
});

export const pelanggan = pgTable("pelanggan", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  nama: varchar({ length: 255 }).notNull(),
  alamat: text().notNull(),
  noTelp: varchar({ length: 13 }).notNull()
});

export const detailPenjualan = pgTable("detail_penjualan", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  detailID: integer().notNull(),
  produkID: integer().notNull(),
  jumlahProduk: integer().notNull(),
  subTotal: decimal({ precision: 10, scale: 2 }).notNull()
});

export const products = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  namaProduk: varchar({ length: 255 }).notNull(),
  hargaProduk: decimal({ precision: 10, scale: 2 }).notNull(),
  stock: integer().notNull()
});

// Tambahkan relations
export const penjualanRelations = relations(penjualan, ({ one }) => ({
  pelanggan: one(pelanggan, {
    fields: [penjualan.pelanganID],
    references: [pelanggan.id]
  }),
  user: one(users, {
    fields: [penjualan.userID],
    references: [users.id]
  })
}));

export const detailPenjualanRelations = relations(detailPenjualan, ({ one }) => ({
  penjualan: one(penjualan, {
    fields: [detailPenjualan.detailID],
    references: [penjualan.id]
  }),
  product: one(products, {
    fields: [detailPenjualan.produkID],
    references: [products.id]
  })
}));
