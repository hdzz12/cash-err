"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MemberForm } from "./member-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { LoadingState } from "@/components/loading-state";

// Temporary type for member data
type Member = {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
  status: "active" | "inactive"
};

export default function MemberDashboard() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: "M001",
      name: "John Doe",
      email: "john@example.com",
      phone: "08123456789",
      joinDate: "2024-01-01",
      status: "active"
    }
    // Add more sample data as needed
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  // Remove the non-existent query
  // const { isLoading } = api.member.all.useQuery();
  // Replace with local state
  const [isLoading] = useState(false);

  if (isLoading) {
    return <LoadingState skeletonCount={5} />;
  }

  // Create new member
  const handleAddMember = (data: Omit<Member, "id" | "joinDate">) => {
    const newMember: Member = {
      id: `M${String(members.length + 1).padStart(3, "0")}`,
      joinDate: new Date().toISOString().split("T")[0],
      ...data
    };

    setMembers([...members, newMember]);
    setIsDialogOpen(false);
    toast.success("Member berhasil ditambahkan");
  };

  // Update existing member
  const handleUpdateMember = (data: Omit<Member, "id" | "joinDate">) => {
    if (!editingMember) return;

    setMembers(members.map(member =>
      member.id === editingMember.id
        ? { ...member, ...data }
        : member
    ));

    setEditingMember(null);
    setIsDialogOpen(false);
    toast.success("Member berhasil diperbarui");
  };

  // Filter and search members
  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase())
      || member.email.toLowerCase().includes(searchQuery.toLowerCase())
      || member.phone.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || member.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
    setMemberToDelete(null);
    toast.success("Member berhasil dihapus");
  };

  return (
    <div className="container mx-auto p-6 pl-80">
      <div className="flex flex-col gap-4">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Member</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Member Aktif</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {members.filter(m => m.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Member Tidak Aktif</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {members.filter(m => m.status === "inactive").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Cari member..."
              className="max-w-[250px]"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="max-w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Member</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingMember(null)}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Tambah Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? "Edit Member" : "Tambah Member Baru"}
                </DialogTitle>
              </DialogHeader>
              <MemberForm
                initialData={editingMember ?? undefined}
                onSubmit={editingMember ? handleUpdateMember : handleAddMember}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Table Section */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Tanggal Bergabung</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map(member => (
                <TableRow key={member.id}>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        member.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingMember(member);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setMemberToDelete(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add AlertDialog for delete confirmation */}
      <AlertDialog open={!!memberToDelete} onOpenChange={open => !open && setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Data</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data member ini?
              Aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => memberToDelete && handleDelete(memberToDelete)}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
