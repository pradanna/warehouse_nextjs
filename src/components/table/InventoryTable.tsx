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

  const [editId, setEditId] = useState(null);
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
  const [itemId, setItemId] = useState<string | number>("");
  const [unitId, setUnitId] = useState<string | number>("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");

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
    const res = await axios.get(`${baseUrl}/item`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setItems(res.data.data);
  };

  const fetchUnits = async () => {
    const res = await axios.get(`${baseUrl}/unit`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setUnits(res.data.data);
  };

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

  const fetchOutlet = async (page = 1) => {
    setIsLoadingTable(true);
    try {
      const response = await axios.get(`${baseUrl}/outlet`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setOutlets(response.data.data);
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
    resetAddInventoryForm(), setIsModalOpen(true);
  };
  const handleClose = () => setIsModalOpen(false);

  const handleEdit = async (id: string) => {
    try {
      const res = await axios.get(`${baseUrl}/inventory/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = res.data.data;

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
      const payload = {
        item_id: addItemId,
        unit_id: addUnitId,
        sku: addSku,
        description: addDescription,
        min_stock: addMinStock,
        max_stock: addMaxStock,
        prices: Object.entries(outletPrices)
          .filter(
            ([_, price]) =>
              price !== null && price !== undefined && price !== undefined
          )
          .map(([outletId, price]) => ({
            outlet_id: outletId,
            price: Number(price),
          })),
      };

      await axios.post(`${baseUrl}/inventory`, payload, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

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

      await axios.put(
        `${baseUrl}/inventory/${editId}`,
        {
          item_id: editItemId,
          unit_id: editUnitId,
          sku: editSku,
          description: editDescription,
          current_stock: editCurrentStock,
          min_stock: editMinStock,
          max_stock: editMaxStock,
          prices: pricesArray, // harga per outlet
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
        <GenosModal
          title="Tambah Inventory"
          onClose={handleClose}
          onSubmit={handleSubmit}
          show
          size="xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Kolom 1: Form utama (6/12) */}
            <div className="lg:col-span-6">
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
                id="tambah-sku"
                label="SKU"
                value={addSku}
                onChange={(e) => setAddSku(e.target.value)}
                className="mb-3"
              />
              <GenosTextfield
                id="tambah-deskripsi"
                label="Deskripsi"
                value={addDescription}
                onChange={(e) => setAddDescription(e.target.value)}
                className="mb-3"
              />
              <GenosTextfield
                id="tambah-stok"
                label="Stok Saat Ini"
                type="number"
                value={addCurrentStock.toString()}
                onChange={(e) => setAddCurrentStock(Number(e.target.value))}
                className="mb-3"
              />
              <GenosTextfield
                id="tambah-stok-min"
                label="Stok Minimum"
                type="number"
                value={addMinStock.toString()}
                onChange={(e) => setAddMinStock(Number(e.target.value))}
                className="mb-3"
              />
              <GenosTextfield
                id="tambah-stok-max"
                label="Stok Maksimum"
                type="number"
                value={addMaxStock.toString()}
                onChange={(e) => setAddMaxStock(Number(e.target.value))}
              />
            </div>

            {/* Kolom 2 & 3: Harga per outlet dibagi dua kolom */}
            {[0, 1].map((groupIndex) => (
              <div
                key={groupIndex}
                className="lg:col-span-3 space-y-4 max-h-[520px] overflow-y-auto pr-1"
              >
                <h3 className="text-md font-semibold">
                  Harga per Outlet {groupIndex + 1}
                </h3>
                {outlets
                  .filter((_, i) => i % 2 === groupIndex)
                  .map((outlet) => (
                    <div
                      key={outlet.id}
                      className="border border-gray-200 rounded-xl p-3"
                    >
                      <div className="text-sm font-medium">{outlet.name}</div>
                      <div className="text-xs text-gray-500 mb-2">
                        {outlet.address}
                      </div>
                      <GenosTextfield
                        id={(
                          "tambah-harga-" + outletPrices[outlet.id] || ""
                        ).toString()}
                        label="Harga"
                        type="number"
                        value={(outletPrices[outlet.id] || "").toString()}
                        onChange={(e) =>
                          setOutletPrices((prev) => ({
                            ...prev,
                            [outlet.id]: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </GenosModal>
      )}

      {isModalEditOpen && (
        <GenosModal
          title="Edit Inventory"
          onClose={() => setIsModalEditOpen(false)}
          onSubmit={handleSubmitEdit}
          show
          size="xl"
        >
          <div className="grid grid-cols-12 gap-4">
            {/* 🟢 Kolom Kiri - Input utama (col-span-6) */}
            <div className="col-span-12 md:col-span-6">
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
                id="edit-sku"
                label="SKU"
                value={editSku}
                onChange={(e) => setEditSku(e.target.value)}
                className="mb-3"
              />
              <GenosTextfield
                id="edit-deskripsi"
                label="Deskripsi"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="mb-3"
              />

              <GenosTextfield
                id="edit-stok"
                label="Stok Saat Ini"
                type="number"
                value={editCurrentStock.toString()}
                onChange={(e) => setEditCurrentStock(Number(e.target.value))}
                className="mb-3"
              />
              <GenosTextfield
                id="edit-stok-min"
                label="Stok Minimum"
                type="number"
                value={editMinStock.toString()}
                onChange={(e) => setEditMinStock(Number(e.target.value))}
                className="mb-3"
              />
              <GenosTextfield
                id="edit-stok-max"
                label="Stok Maksimum"
                type="number"
                value={editMaxStock.toString()}
                onChange={(e) => setEditMaxStock(Number(e.target.value))}
              />
            </div>

            {[0, 1].map((groupIndex) => (
              <div
                key={groupIndex}
                className="lg:col-span-3 space-y-4 max-h-[520px] overflow-y-auto pr-1"
              >
                <h3 className="text-md font-semibold">
                  Harga per Outlet {groupIndex + 1}
                </h3>
                {outlets
                  .filter((_, i) => i % 2 === groupIndex)
                  .map((outlet) => (
                    <div
                      key={outlet.id}
                      className="border border-gray-200 rounded-xl p-3"
                    >
                      <div className="text-sm font-medium">{outlet.name}</div>
                      <div className="text-xs text-gray-500 mb-2">
                        {outlet.address}
                      </div>
                      <GenosTextfield
                        id={(
                          "edit-harga-" + editOutletPrices[outlet.id] || ""
                        ).toString()}
                        label="Harga"
                        type="number"
                        value={editOutletPrices[outlet.id]?.toString() || ""}
                        onChange={(e) =>
                          setEditOutletPrices((prev) => ({
                            ...prev,
                            [outlet.id]: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </GenosModal>
      )}
    </>
  );
};

export default InventoryTable;
