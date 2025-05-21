"use client";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import GenosButton from "@/components/button/GenosButton";
import GenosPanel from "@/components/panel/GenosPanel";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import UserTable from "@/components/table/UserTable";

export default function DashboardPage() {
  const [filters, setFilters] = useState({ name: "", email: "" });
  const TABLE_HEAD = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role" },
  ];

  const TABLE_ROWS = [
    { name: "Agus", email: "agus@example.com", role: "Admin" },
  ];

  const filteredData = TABLE_ROWS.filter((item) => {
    return (
      item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      item.email.toLowerCase().includes(filters.email.toLowerCase())
    );
  });

  const handleView = (row: any) => alert(`View: ${row.name}`);
  const handleEdit = (row: any) => alert(`Edit: ${row.name}`);
  const handleDelete = (row: any) => {
    if (confirm(`Yakin hapus ${row.name}?`)) {
      alert("Dihapus!");
    }
  };

  return <div></div>;
}
