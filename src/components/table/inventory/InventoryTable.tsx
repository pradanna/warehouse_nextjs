import { useEffect, useMemo, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { toast } from "react-toastify";
import GenosSearchSelect from "../../form/GenosSearchSelect";
import {
  createInventory,
  deleteInventory,
  getInventory,
  getInventoryById,
  updateInventory,
} from "@/lib/api/inventory/inventoryApi";
import { getItems } from "@/lib/api/itemApi";
import { getUnit } from "@/lib/api/unitApi";
import { getOutlet } from "@/lib/api/outletApi";
import AddInventoryModal from "@/components/form/inventory/AddInventoryModal";
import EditInventoryModal from "@/components/form/inventory/EditInventoryModal";
import GenosSearchSelectItem from "@/components/select-search/ItemSearch";

const InventoryTable = () => {
  // Contoh data option untuk filter (bisa dari API)

  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  const [searchItemId, setSearchItemId] = useState("");
  const [searchItemName, setSearchItemName] = useState("");
  const [editId, setEditId] = useState("");

  // Filter States
  const [param, setparam] = useState("");

  const TABLE_HEAD = useMemo(
    () => [
      { key: "sku", label: "SKU", sortable: true },
      { key: "item.name", label: "Name", sortable: true },
      { key: "unit.name", label: "Unit", sortable: false },
      {
        key: "description",
        label: "Deskripsi",
        sortable: false,
      },
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
      const res = await getInventory(param, currentPage, limit);
      console.log(res.data);
      setTABLE_ROWS(res.data);

      console.log(res.meta.total_rows);
      setTotalItems(res.meta.total_rows);
    } catch (err) {
      toast.error("Gagal mengambil data inventory");
    }
    setIsLoadingTable(false);
  };

  useEffect(() => {
    fetchInventory();
  }, [currentPage]);

  const handleOpen = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => setIsModalOpen(false);
  const handleEditClose = () => setIsModalEditOpen(false);

  const handleEdit = async (id: string) => {
    setEditId(id);
    setIsModalEditOpen(true);
  };

  useEffect(() => {
    fetchInventory();
  }, [searchItemName]);

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
      <GenosTable
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={TABLE_ROWS}
        PAGINATION
        rowsPerPage={limit}
        totalRows={totalItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onAddData={handleOpen}
        loading={isLoadingTable}
        isDanger={(row) => row.current_stock < row.min_stock}
        isGreat={(row) => row.current_stock > row.max_stock}
        FILTER={
          <div className="flex gap-4 mb-4 items-end w-52">
            <GenosSearchSelectItem
              value={searchItemId}
              label="Item"
              placeholder="Pilih item"
              className="text-xs w-6xl"
              onChange={(option) => {
                setSearchItemId(option?.value);
                setSearchItemName(option?.label);
                setparam(option?.label);
              }}
            />

            {/* <GenosSearchSelect
              label="Unit"
              placeholder="Pilih unit"
              className="w-64 text-xs"
              options={units.map((u) => ({ value: u.id, label: u.name }))}
              value={unitId}
              onChange={setUnitId}
            />

            <GenosTextfield
              id="search-sku"
              label="SKU"
              placeholder="Masukkan SKU"
              className="w-64 text-xs"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />

            <GenosTextfield
              id="search-deskripsi"
              label="Deskripsi"
              placeholder="Cari deskripsi"
              className="w-64 text-xs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            /> */}
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
