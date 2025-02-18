"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { LoadingState } from "@/components/loading-state";

export default function Manajemen() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean, userId: number | null }>({
    isOpen: false,
    userId: null
  });
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    username: "",
    password: "",
    level: "user" as const
  });

  const utils = api.useContext();
  const { data: users, isLoading } = api.user.list.useQuery();

  const { mutate: createUser } = api.user.create.useMutation({
    onSuccess: () => {
      toast.success("Berhasil menambah pengguna");
      handleCloseDialog();
      utils.user.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const { mutate: updateUser } = api.user.update.useMutation({
    onSuccess: () => {
      toast.success("Berhasil mengupdate pengguna");
      handleCloseDialog();
      utils.user.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const { mutate: deleteUser } = api.user.delete.useMutation({
    onSuccess: () => {
      toast.success("Berhasil menghapus pengguna");
      utils.user.list.invalidate();
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
      name: "",
      username: "",
      password: "",
      level: "user"
    });
  };

  const handleEdit = (user: any) => {
    setFormData({
      id: user.id,
      name: user.name,
      username: user.username,
      password: "",
      level: user.level
    });
    setIsEdit(true);
    setIsOpen(true);
  };

  const handleDeleteClick = (userId: number) => {
    setDeleteConfirm({ isOpen: true, userId });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.userId) {
      deleteUser({ id: deleteConfirm.userId });
      setDeleteConfirm({ isOpen: false, userId: null });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updateUser({
        id: formData.id,
        name: formData.name,
        username: formData.username,
        ...(formData.password && { password: formData.password }),
        level: formData.level
      });
    }
    else {
      createUser(formData);
    }
  };

  if (isLoading) {
    return <LoadingState title="Memuat data pengguna..." skeletonCount={4} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen pl-80">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
        <Button onClick={() => setIsOpen(true)}>Tambah Pengguna</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Nama</TableHead>
              <TableHead className="text-center">Username</TableHead>
              <TableHead className="text-center">Level</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map(user => (
              <TableRow key={user.id}>
                <TableCell className="text-center">{user.name}</TableCell>
                <TableCell className="text-center">{user.username}</TableCell>
                <TableCell className="text-center">{user.level}</TableCell>
                <TableCell className="space-x-2 text-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(user.id)}
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
              {isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Nama</label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label>Username</label>
              <Input
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <label>
                Password
                {isEdit && " (Kosongkan jika tidak ingin mengubah)"}
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <label>Level</label>
              <select
                className="w-full border p-2 rounded"
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
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
            <p>Apakah Anda yakin ingin menghapus pengguna ini?</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ isOpen: false, userId: null })}
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
