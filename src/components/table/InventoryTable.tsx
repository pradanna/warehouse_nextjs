import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosModal from "@/components/modal/GenosModal";
import GenosSelect from "@/components/form/GenosSelect";
import { baseUrl, getToken } from "@/app/config/config";
import { toast } from "react-toastify";
import GenosSearchSelect from "../form/GenosSearchSelect";

const InventoryTable = () => {
  // Contoh data option untuk filter (bisa dari API)

  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);

  const [items, setItems] = useState([
    { id: "item-1", name: "Item A" },
    { id: "item-2", name: "Item B" },
  ]);
  const [units, setUnits] = useState([
    { id: "unit-1", name: "PCS" },
    { id: "unit-2", name: "BOX" },
  ]);

  const [addItemId, setAddItemId] = useState("");
  const [addUnitId, setAddUnitId] = useState("");
  const [addSku, setAddSku] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addPrice, setAddPrice] = useState(0);
  const [addCurrentStock, setAddCurrentStock] = useState(0);
  const [addMinStock, setAddMinStock] = useState(0);
  const [addMaxStock, setAddMaxStock] = useState(0);

  const [editId, setEditId] = useState(null);
  const [editItemId, setEditItemId] = useState("");
  const [editUnitId, setEditUnitId] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editCurrentStock, setEditCurrentStock] = useState(0);
  const [editMinStock, setEditMinStock] = useState(0);
  const [editMaxStock, setEditMaxStock] = useState(0);

  // Filter States
  const [itemId, setItemId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");

  const TABLE_HEAD = useMemo(
    () => [
      { key: "sku", label: "SKU", sortable: true },
      { key: "name", label: "Name", sortable: true },
      { key: "unit", label: "Unit", sortable: false },
      { key: "description", label: "Deskripsi", sortable: false },
      { key: "price", label: "Harga", sortable: false },
      { key: "current_stock", label: "Stok", sortable: false },
    ],
    []
  );

  const fetchInventory = async () => {
    setIsLoadingTable(true);
    try {
      const res = await axios.get(
        `${baseUrl}/inventory?page=${currentPage}&per_page=${limit}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setTABLE_ROWS(res.data.data);
      setTotalItems(res.data.total);
    } catch (err) {
      toast.error("Gagal mengambil data inventory");
    }
    setIsLoadingTable(false);
  };

  const resetAddInventoryForm = () => {
    setAddItemId("");
    setAddUnitId("");
    setAddSku("");
    setAddDescription("");
    setAddPrice(0);
    setAddCurrentStock(0);
    setAddMinStock(0);
    setAddMaxStock(0);
  };

  const fetchItemsAndUnits = async () => {
    try {
      const [itemsRes, unitsRes] = await Promise.all([
        axios.get(`${baseUrl}/item`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        axios.get(`${baseUrl}/unit`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);
      setItems(itemsRes.data.data);
      setUnits(unitsRes.data.data);
    } catch (err) {
      toast.error("Gagal mengambil data item/unit");
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchItemsAndUnits();
  }, [currentPage]);

  const handleOpen = () => {
    resetAddInventoryForm(), setIsModalOpen(true);
  };
  const handleClose = () => setIsModalOpen(false);

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`${baseUrl}/inventory/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = res.data;
      setEditId(data.data.id);
      setEditItemId(data.data.name);
      setEditUnitId(data.data.unit);
      setEditSku(data.data.sku);
      setEditDescription(data.data.description);
      setEditPrice(data.data.price);
      setEditCurrentStock(data.data.current_stock);
      setEditMinStock(data.data.min_stock);
      setEditMaxStock(data.data.max_stock);
      setIsModalEditOpen(true);

      console.log("EDIT SKU " + data.data);
    } catch (err) {
      toast.error("Gagal mengambil detail inventory");
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [itemId, unitId, sku, description]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/inventory/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchInventory();
      toast.success("Berhasil menghapus inventory");
    } catch (err) {
      toast.error("Gagal menghapus inventory");
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${baseUrl}/inventory`,
        {
          item_id: addItemId,
          unit_id: addUnitId,
          sku: addSku,
          description: addDescription,
          price: addPrice,
          current_stock: addCurrentStock,
          min_stock: addMinStock,
          max_stock: addMaxStock,
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      handleClose();
      fetchInventory();
      toast.success("Berhasil menambahkan inventory");
    } catch (err) {
      toast.error("Gagal menambahkan inventory");
    }
  };

  const handleSubmitEdit = async () => {
    try {
      await axios.put(
        `${baseUrl}/inventory/${editId}`,
        {
          item_id: editItemId,
          unit_id: editUnitId,
          sku: editSku,
          description: editDescription,
          price: editPrice,
          current_stock: editCurrentStock,
          min_stock: editMinStock,
          max_stock: editMaxStock,
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setIsModalEditOpen(false);
      fetchInventory();
      toast.success("Berhasil mengubah inventory");
    } catch (err) {
      toast.error("Gagal mengubah inventory");
    }
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
        isBelowStock={(row) => row.current_stock < row.min_stock}
        isAboveStock={(row) => row.current_stock > row.max_stock}
        FILTER={
          <div className="flex gap-4 mb-4 items-end ">
            <GenosSearchSelect
              label="Item"
              placeholder="Pilih item"
              className=" text-xs"
              options={items.map((i) => ({ value: i.id, label: i.name }))}
              value={itemId}
              onChange={setItemId}
            />

            <GenosSearchSelect
              label="Unit"
              placeholder="Pilih unit"
              className="w-64 text-xs"
              options={units.map((u) => ({ value: u.id, label: u.name }))}
              value={unitId}
              onChange={setUnitId}
            />

            <GenosTextfield
              label="SKU"
              placeholder="Masukkan SKU"
              className="w-64 text-xs"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />

            <GenosTextfield
              label="Deskripsi"
              placeholder="Cari deskripsi"
              className="w-64 text-xs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        }
        ACTION_BUTTON={{
          edit: (row) => handleEdit(row.id),
          delete: (row) => handleDelete(row.id),
        }}
      />

      {isModalOpen && (
        <GenosModal
          title="Tambah Inventory"
          onClose={handleClose}
          onSubmit={handleSubmit}
          show
          size="md"
        >
          <GenosSearchSelect
            label="Item"
            options={items.map((i) => ({ value: i.id, label: i.name }))}
            value={addItemId}
            onChange={setAddItemId}
            placeholder="Pilih item"
            className="mb-3"
          />
          <GenosSearchSelect
            label="Unit"
            options={units.map((u) => ({ value: u.id, label: u.name }))}
            value={addUnitId}
            onChange={setAddUnitId}
            placeholder="Pilih unit"
            className="mb-3"
          />
          <GenosTextfield
            label="SKU"
            value={addSku}
            onChange={(e) => setAddSku(e.target.value)}
            className="mb-3"
          />
          <GenosTextfield
            label="Deskripsi"
            value={addDescription}
            onChange={(e) => setAddDescription(e.target.value)}
            className="mb-3"
          />
          <GenosTextfield
            label="Harga"
            type="number"
            value={addPrice}
            onChange={(e) => setAddPrice(Number(e.target.value))}
            className="mb-3"
          />
          <GenosTextfield
            label="Stok Saat Ini"
            type="number"
            value={addCurrentStock}
            onChange={(e) => setAddCurrentStock(Number(e.target.value))}
            className="mb-3"
          />
          <GenosTextfield
            label="Stok Minimum"
            type="number"
            value={addMinStock}
            onChange={(e) => setAddMinStock(Number(e.target.value))}
            className="mb-3"
          />
          <GenosTextfield
            label="Stok Maksimum"
            type="number"
            value={addMaxStock}
            onChange={(e) => setAddMaxStock(Number(e.target.value))}
          />
        </GenosModal>
      )}

      {isModalEditOpen && (
        <GenosModal
          title="Edit Inventory"
          onClose={() => setIsModalEditOpen(false)}
          onSubmit={handleSubmitEdit}
          show
          size="md"
        >
          <GenosSearchSelect
            label="Item"
            options={items.map((i) => ({ value: i.id, label: i.name }))}
            value={editItemId}
            onChange={setEditItemId}
            placeholder="Pilih item"
            className="mb-3"
          />
          <GenosSearchSelect
            label="Unit"
            options={units.map((u) => ({ value: u.id, label: u.name }))}
            value={editUnitId}
            onChange={setEditUnitId}
            placeholder="Pilih unit"
            className="mb-3"
          />
          <GenosTextfield
            label="SKU"
            value={editSku}
            onChange={(e) => setEditSku(e.target.value)}
            className="mb-3"
          />
          <GenosTextfield
            label="Deskripsi"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="mb-3"
          />
          <GenosTextfield
            label="Harga"
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(Number(e.target.value))}
            className="mb-3"
          />
          <GenosTextfield
            label="Stok Saat Ini"
            type="number"
            value={editCurrentStock}
            onChange={(e) => setEditCurrentStock(Number(e.target.value))}
            className="mb-3"
          />
          <GenosTextfield
            label="Stok Minimum"
            type="number"
            value={editMinStock}
            onChange={(e) => setEditMinStock(Number(e.target.value))}
            className="mb-3"
          />
          <GenosTextfield
            label="Stok Maksimum"
            type="number"
            value={editMaxStock}
            onChange={(e) => setEditMaxStock(Number(e.target.value))}
          />
        </GenosModal>
      )}
    </>
  );
};

export default InventoryTable;
