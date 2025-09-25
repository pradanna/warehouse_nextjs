import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  deleteInventory,
  getInventory,
} from "@/lib/api/inventory/inventoryApi";
import AddInventoryModal from "@/components/form/inventory/AddInventoryModal";
import EditInventoryModal from "@/components/form/inventory/EditInventoryModal";
import GenosTableFrontend from "../GenosTableFrontend";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosSearchSelect from "@/components/form/GenosSearchSelect";

const InventoryTable = () => {
  const [TABLE_ROWS, setTABLE_ROWS] = useState<any[]>([]);
  const [FILTERED_ROWS, setFILTERED_ROWS] = useState<any[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [editId, setEditId] = useState("");

  // Filter states
  const [sku, setSku] = useState("");
  const [itemName, setItemName] = useState("");
  const [unitName, setUnitName] = useState("");
  const [dangerOnly, setDangerOnly] = useState(false);

  const TABLE_HEAD = useMemo(
    () => [
      { key: "sku", label: "SKU", sortable: true },
      { key: "item.name", label: "Name", sortable: true },
      { key: "unit.name", label: "Unit", sortable: false },
      { key: "description", label: "Deskripsi", sortable: false },
      {
        key: "current_stock",
        label: "Stok",
        sortable: true,
        type: "number",
      },
    ],
    []
  );

  const fetchInventory = async () => {
    setIsLoadingTable(true);
    try {
      const res = await getInventory("", currentPage, 100000000);
      setTABLE_ROWS(res.data);
      setFILTERED_ROWS(res.data);
    } catch (err) {
      toast.error("Gagal mengambil data inventory");
    }
    setIsLoadingTable(false);
  };

  // Apply frontend filter
  useEffect(() => {
    let filtered = [...TABLE_ROWS];

    if (sku) {
      filtered = filtered.filter((row) =>
        row.sku?.toLowerCase().includes(sku.toLowerCase())
      );
    }

    if (itemName) {
      filtered = filtered.filter((row) =>
        row.item?.name?.toLowerCase().includes(itemName.toLowerCase())
      );
    }

    if (unitName) {
      filtered = filtered.filter((row) =>
        row.unit?.name?.toLowerCase().includes(unitName.toLowerCase())
      );
    }

    if (dangerOnly) {
      filtered = filtered.filter((row) => row.current_stock < row.min_stock);
    }

    setFILTERED_ROWS(filtered);
  }, [sku, itemName, unitName, dangerOnly, TABLE_ROWS]);

  useEffect(() => {
    fetchInventory();
  }, [currentPage]);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
  const handleEditClose = () => setIsModalEditOpen(false);

  const handleEdit = async (id: string) => {
    setEditId(id);
    setIsModalEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInventory(id);
      fetchInventory();
      toast.success("Berhasil menghapus inventory");
    } catch (err) {
      toast.error("Gagal menghapus inventory");
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchInventory();
    setIsModalEditOpen(false);
  };

  return (
    <>
      <GenosTableFrontend
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={FILTERED_ROWS}
        PAGINATION
        SORT
        rowsPerPage={limit}
        onAddData={handleOpen}
        loading={isLoadingTable}
        isDanger={(row) => row.current_stock < row.min_stock}
        isGreat={(row) => row.current_stock > row.max_stock}
        FILTER={
          <div className="flex flex-wrap gap-4 mb-4 items-end">
            <GenosTextfield
              id="search-sku"
              label="SKU"
              placeholder="Cari SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-48"
            />

            <GenosTextfield
              id="search-item"
              label="Item Name"
              placeholder="Cari Item"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-64"
            />

            <GenosTextfield
              id="search-unit"
              label="Unit Name"
              placeholder="Cari Unit"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              className="w-48"
            />

            <GenosSearchSelect
              label="Filter Stok"
              options={[{ value: "danger", label: "Stok Mau Habis" }]}
              value={dangerOnly ? "danger" : "all"}
              onChange={(val: any) => setDangerOnly(val === "danger")}
              className="w-48"
            />
          </div>
        }
        ACTION_BUTTON={{
          edit: (row) => handleEdit(row.id),
          delete: (row) => handleDelete(row.id),
        }}
      />

      {isModalOpen && (
        <AddInventoryModal
          show
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}

      {isModalEditOpen && (
        <EditInventoryModal
          show
          idInventory={editId}
          onClose={handleEditClose}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default InventoryTable;
