"use client";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import GenosButton from "@/components/button/GenosButton";
import GenosPanel from "@/components/panel/GenosPanel";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import UserTable from "@/components/table/UserTable";

export default function InventoryPage() {
  const [filters, setFilters] = useState({ name: "", email: "" });
  const TABLE_HEAD = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role" },
  ];

  const TABLE_ROWS = [
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Agus", email: "agus@example.com", role: "Admin" },
    { name: "Budi", email: "budi@example.com", role: "User" },
    { name: "Citra", email: "citra@example.com", role: "User" },
    { name: "Dina", email: "dina@example.com", role: "Moderator" },
    { name: "Eka", email: "eka@example.com", role: "User" },
    { name: "Eka", email: "eka@example.com", role: "User" },
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

  return (
    <div>
      <GenosPanel title="Button" subtitle="Genos Button">
        <div>
          <GenosButton
            color="success"
            size="lg"
            className="me-2"
            round="md"
            label="Large"
          />

          <GenosButton
            color="warning"
            size="md"
            className="me-2"
            round="md"
            label="Medium"
            iconLeft={<MagnifyingGlassIcon className="w-4" />}
          />

          <GenosButton
            color="danger"
            size="sm"
            className="me-2"
            round="md"
            label="SMALL"
            iconRight={<MagnifyingGlassIcon className="w-4" />}
          />
        </div>
      </GenosPanel>

      <GenosPanel title="Table" subtitle="Genos Tabel" className="mt-3">
        {/* <GenosTable
          TABLE_HEAD={TABLE_HEAD}
          TABLE_ROWS={filteredData}
          SORT
          PAGINATION
          FILTER={
            <div className="flex gap-4">
              <GenosTextfield
                label="Search Name"
                placeholder="Search Name"
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />
              <GenosTextfield
                label="Search Email"
                placeholder="Search Email"
                value={filters.email}
                onChange={(e) =>
                  setFilters({ ...filters, email: e.target.value })
                }
              />
           
            </div>
          }
          ACTION_BUTTON={{
            view: handleView,
            edit: handleEdit,
            delete: handleDelete,
          }}
        />
     */}

        <UserTable />
      </GenosPanel>

      <GenosPanel className="mt-3" title="Textfield" subtitle="Genos Textfield">
        <GenosTextfield
          label="Search"
          is_icon_left={true}
          placeholder="Type something..."
          // value={search}
          // onChange={(e) => setSearch(e.target.value)}
        />
      </GenosPanel>
    </div>
  );
}
