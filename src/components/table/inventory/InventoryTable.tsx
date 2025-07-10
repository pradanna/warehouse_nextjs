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
} from "@/lib/api/inventoryApi";
import { getItems } from "@/lib/api/itemApi";
import { getUnit } from "@/lib/api/unitApi";
import { getOutlet } from "@/lib/api/outletApi";
import AddInventoryModal from "@/components/form/inventory/AddInventoryModal";
import EditInventoryModal from "@/components/form/inventory/EditInventoryModal";

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

  const [addItemId, setAddItemId] = useState<string | number>("");
  const [addUnitId, setAddUnitId] = useState<string | number>("");
  const [addSku, setAddSku] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addPrice, setAddPrice] = useState(0);
  const [addCurrentStock, setAddCurrentStock] = useState(0);
  const [addMinStock, setAddMinStock] = useState(0);
  const [addMaxStock, setAddMaxStock] = useState(0);
  const [outletPrices, setOutletPrices] = useState<{ [key: string]: number }>(
    {}
  );
  const [outlets, setOutlets] = useState<any[]>([]);

  const [editId, setEditId] = useState("");
  const [editItemId, setEditItemId] = useState<string | number>("");
  const [editUnitId, setEditUnitId] = useState<string | number>("");
  const [editSku, setEditSku] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editCurrentStock, setEditCurrentStock] = useState(0);
  const [editMinStock, setEditMinStock] = useState(0);
  const [editMaxStock, setEditMaxStock] = useState(0);
  const [editOutletPrices, setEditOutletPrices] = useState<{
    [key: string]: number;
  }>({});

  // Filter States
  const [itemId, setItemId] = useState<string | number | null>("");
  const [unitId, setUnitId] = useState<string | number | null>("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [param, setparam] = useState("");

  const TABLE_HEAD = useMemo(
    () => [
      { key: "sku", label: "SKU", sortable: true },
      { key: "item.name", label: "Name", sortable: true },
      { key: "unit.name", label: "Unit", sortable: false },
      { key: "description", label: "Deskripsi", sortable: false },
      { key: "current_stock", label: "Stok", sortable: false },
    ],
    []
  );

  useEffect(() => {
    fetchItems();
    fetchUnits();
  }, []);

  const fetchItems = async () => {
    const res = await getItems("", 1, 1000);
    setItems(res.data);
  };

  const fetchUnits = async () => {
    const res = await getUnit("", 1, 1000);
    setUnits(res.data);
  };

  const fetchInventory = async () => {
    setIsLoadingTable(true);
    try {
      const res = await getInventory(param, currentPage, limit);
      console.log(res.data);
      setTABLE_ROWS(res.data);
      setTotalItems(res.total);
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
    setOutletPrices({});
  };

  const fetchItemsAndUnits = async () => {
    try {
      const [itemsRes, unitsRes] = await Promise.all([
        getItems("", 1, 1000),
        getUnit("", 1, 1000),
      ]);
      setItems(itemsRes.data);
      setUnits(unitsRes.data);
    } catch (err) {
      toast.error("Gagal mengambil data item/unit");
    }
  };

  const fetchOutlet = async (page = 1) => {
    setIsLoadingTable(true);
    try {
      const response = await getOutlet("", 1, 1000);

      setOutlets(response.data);
    } catch (err) {
      console.error("Gagal mengambil outlet:", err);
    } finally {
      setIsLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchItemsAndUnits();
    fetchOutlet();
  }, [currentPage]);

  const handleOpen = () => {
    resetAddInventoryForm();
    setIsModalOpen(true);
  };
  const handleClose = () => setIsModalOpen(false);
  const handleEditClose = () => setIsModalEditOpen(false);

  const handleEdit = async (id: string) => {
    try {
      const res = await getInventoryById(id);

      const data = res.data;

      if (items.length === 0 || units.length === 0) {
        await Promise.all([fetchItems(), fetchUnits()]);
      }

      console.log("data" + data);
      console.log("data.item_id" + data.item.id);
      console.log("data.unit_id" + data.unit.id);

      setEditId(data.id);
      setEditItemId(data.item.id);
      setEditUnitId(data.unit.id);
      setEditSku(data.sku);
      setEditDescription(data.description);
      setEditCurrentStock(data.current_stock);
      setEditMinStock(data.min_stock);
      setEditMaxStock(data.max_stock);

      // Atur harga per outlet
      const outletPricesObj: { [key: string]: number } = {};
      data.prices?.forEach(
        (priceObj: { outlet: { id: string }; price: number }) => {
          const outletId = priceObj.outlet?.id;
          if (outletId) {
            outletPricesObj[outletId] = priceObj.price;
          } else {
            console.warn("Ditemukan harga tanpa outlet id:", priceObj);
          }
        }
      );

      console.log("outletPriceObj =", JSON.stringify(outletPricesObj, null, 2));

      setEditOutletPrices(outletPricesObj); // asumsikan kamu pakai state ini
      setIsModalEditOpen(true);
    } catch (err) {
      toast.error("Gagal mengambil detail inventory");
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [itemId, unitId, sku, description]);

  const handleDelete = async (id: string) => {
    try {
      await deleteInventory(id);
      fetchInventory();
      toast.success("Berhasil menghapus inventory");
    } catch (err) {
      toast.error("Gagal menghapus inventory");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await createInventory(
        addItemId,
        addUnitId,
        addSku,
        addDescription,
        addMinStock,
        addMaxStock,
        outletPrices
      );

      resetAddInventoryForm();
      handleClose();
      fetchInventory();
      toast.success("Berhasil menambahkan inventory");
    } catch (err) {
      toast.error("Gagal menambahkan inventory");
    }
  };

  const handleSubmitEdit = async () => {
    try {
      const pricesArray = Object.entries(editOutletPrices).map(
        ([outlet_id, price]) => ({
          outlet_id,
          price,
        })
      );

      const response = await updateInventory(
        editId,
        editItemId,
        editUnitId,
        editSku,
        editDescription,
        editCurrentStock,
        editMinStock,
        editMaxStock,
        pricesArray
      );

      resetAddInventoryForm();

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
          items={items}
          units={units}
          outlets={outlets}
          addItemId={addItemId}
          setAddItemId={setAddItemId}
          addUnitId={addUnitId}
          setAddUnitId={setAddUnitId}
          addSku={addSku}
          setAddSku={setAddSku}
          addDescription={addDescription}
          setAddDescription={setAddDescription}
          addCurrentStock={addCurrentStock}
          setAddCurrentStock={setAddCurrentStock}
          addMinStock={addMinStock}
          setAddMinStock={setAddMinStock}
          addMaxStock={addMaxStock}
          setAddMaxStock={setAddMaxStock}
          outletPrices={outletPrices}
          setOutletPrices={setOutletPrices}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      )}

      {isModalEditOpen && (
        <EditInventoryModal
          show
          items={items}
          units={units}
          outlets={outlets}
          editItemId={editItemId}
          setEditItemId={setEditItemId}
          editUnitId={editUnitId}
          setEditUnitId={setEditUnitId}
          editSku={editSku}
          setEditSku={setEditSku}
          editDescription={editDescription}
          setEditDescription={setEditDescription}
          editCurrentStock={editCurrentStock}
          setEditCurrentStock={setEditCurrentStock}
          editMinStock={editMinStock}
          setEditMinStock={setEditMinStock}
          editMaxStock={editMaxStock}
          setEditMaxStock={setEditMaxStock}
          outletPrices={outletPrices}
          setOutletPrices={setOutletPrices}
          onClose={handleEditClose}
          onSubmit={handleSubmitEdit}
        />
      )}
    </>
  );
};

export default InventoryTable;
