"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { LoadingState } from "@/components/loading-state";

export default function Pelanggan() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean, pelangganId: number | null }>({
    isOpen: false,
    pelangganId: null
  });
  const [formData, setFormData] = useState({
    id: 0,
    nama: "",
    alamat: "",
    noTelp: ""
  });

  const utils = api.useContext();
  const { data: pelangganList, isLoading } = api.pelanggan.list.useQuery();

  const { mutate: createPelanggan } = api.pelanggan.create.useMutation({
    onSuccess: () => {
      toast.success("Berhasil menambah pelanggan");
      handleCloseDialog();
      utils.pelanggan.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const { mutate: updatePelanggan } = api.pelanggan.update.useMutation({
    onSuccess: () => {
      toast.success("Berhasil mengupdate pelanggan");
      handleCloseDialog();
      utils.pelanggan.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const { mutate: deletePelanggan } = api.pelanggan.delete.useMutation({
    onSuccess: () => {
      toast.success("Berhasil menghapus pelanggan");
      utils.pelanggan.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleCloseDialog = () => {
    setIsOpen(false);
    setIsEdit(false);
    setFormData({
      id: 0,
      nama: "",
      alamat: "",
      noTelp: ""
    });
  };

  const handleEdit = (pelanggan: any) => {
    setFormData({
      id: pelanggan.id,
      nama: pelanggan.nama,
      alamat: pelanggan.alamat,
      noTelp: pelanggan.noTelp
    });
    setIsEdit(true);
    setIsOpen(true);
  };

  const handleDeleteClick = (pelangganId: number) => {
    setDeleteConfirm({ isOpen: true, pelangganId });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.pelangganId) {
      deletePelanggan({ id: deleteConfirm.pelangganId });
      setDeleteConfirm({ isOpen: false, pelangganId: null });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updatePelanggan({
        id: formData.id,
        nama: formData.nama,
        alamat: formData.alamat,
        noTelp: formData.noTelp
      });
    }
    else {
      createPelanggan({
        nama: formData.nama,
        alamat: formData.alamat,
        noTelp: formData.noTelp
      });
    }
  };

  if (isLoading) {
    return <LoadingState title="Memuat data pelanggan..." skeletonCount={4} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen pl-80">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Pelanggan</h1>
        <Button onClick={() => setIsOpen(true)}>Tambah Pelanggan</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Nama</TableHead>
              <TableHead className="text-center">Alamat</TableHead>
              <TableHead className="text-center">No. Telepon</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pelangganList?.map(pelanggan => (
              <TableRow key={pelanggan.id}>
                <TableCell className="text-center">{pelanggan.nama}</TableCell>
                <TableCell className="text-center">{pelanggan.alamat}</TableCell>
                <TableCell className="text-center">{pelanggan.noTelp}</TableCell>
                <TableCell className="space-x-2 text-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(pelanggan)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(pelanggan.id)}
                  >
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Pelanggan" : "Tambah Pelanggan"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Nama</label>
              <Input
                value={formData.nama}
                onChange={e => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div>
              <label>Alamat</label>
              <Input
                value={formData.alamat}
                onChange={e => setFormData({ ...formData, alamat: e.target.value })}
              />
            </div>
            <div>
              <label>No. Telepon</label>
              <Input
                value={formData.noTelp}
                onChange={e => setFormData({ ...formData, noTelp: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              {isEdit ? "Update" : "Simpan"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm.isOpen} onOpenChange={open => setDeleteConfirm(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Apakah Anda yakin ingin menghapus pelanggan ini?</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ isOpen: false, pelangganId: null })}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
