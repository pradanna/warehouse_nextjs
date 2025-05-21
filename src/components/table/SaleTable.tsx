import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosModal from "@/components/modal/GenosModal";
import GenosSelect from "@/components/form/GenosSelect";
import { baseUrl, getToken } from "@/app/config/config";
import { toast } from "react-toastify";
import GenosSearchSelect from "../form/GenosSearchSelect";
import { XMarkIcon } from "@heroicons/react/24/solid";
import GenosButton from "../button/GenosButton";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SaleTable = () => {
  const [data, setData] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [SaleItems, setSaleItems] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [unit, setUnit] = useState("-");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [inventories, setInventories] = useState([]);

  // State tambahan untuk modal simpan sale
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [outletId, setOutletId] = useState(null);
  const [paymentType, setPaymentType] = useState("cash");
  const [saleDescription, setSaleDescription] = useState("");

  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);

  const subTotal = cartItems.reduce((acc, item) => acc + item.total, 0);
  const discountAmount = (subTotal * discountPercent) / 100;
  const taxAmount = (subTotal * taxPercent) / 100;
  const totalAmount = subTotal - discountAmount + taxAmount;
  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/sale`, {
        params: {
          page: currentPage,
          per_page: limit,
          search: search,
          outlet_id: selectedOutlet,
        },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setData(res.data.data);
      setTotalItems(res.data.total);
    } catch (err) {
      toast.error("Gagal mengambil data sale");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const res = await axios.get(`${baseUrl}/inventory`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        // Sesuaikan dengan struktur data dari API
        setInventories(res.data.data);
      } catch (error) {
        console.error("Gagal memuat inventory:", error);
        toast.error("Gagal memuat data inventory");
      }
    };

    fetchInventories();
  }, []);

  const fetchOutlets = async () => {
    try {
      const res = await axios.get(`${baseUrl}/outlet`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setOutlets(res.data.data);
    } catch (err) {
      toast.error("Gagal mengambil data outlet");
    }
  };

  const handleOpen = () => {
    setIsModalOpen(true);
    // setTimeout(() => inputRefName.current?.focus(), 100);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setSelectedInventory(null);
    setQuantity(1);
    setPrice(0);
    setUnit("-");
    setSelectedCart(null);
  };

  useEffect(() => {
    fetchSales();
  }, [currentPage, limit, search, selectedOutlet]);

  useEffect(() => {
    fetchOutlets();
  }, []);

  const handleSaveCart = () => {
    if (!selectedItem) {
      toast.error("Item belum dipilih");
      return;
    }

    setIsSaving(true);

    const newItem = {
      inventory_id: selectedItem,
      name: selectedInventory?.name,
      unit,
      quantity,
      price,
      total: quantity * price,
    };

    let updatedCart;
    if (selectedCart) {
      updatedCart = cartItems.map((item) =>
        item.inventory_id === selectedCart.inventory_id ? newItem : item
      );
    } else {
      updatedCart = [...cartItems, newItem];
    }

    // Simpan ke state
    setCartItems(updatedCart);
    // Simpan ke localStorage
    localStorage.setItem("sale_cart", JSON.stringify(updatedCart));
    toast.success("Item berhasil ditambahkan ke cart");
    handleClose();
    setIsSaving(false);
  };

  useEffect(() => {
    const storedCart = localStorage.getItem("sale_cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const TABLE_HEAD = useMemo(
    () => [
      { key: "reference_number", label: "Ref#", sortable: true },
      { key: "date", label: "Tanggal", sortable: true },
      { key: "outlet_name", label: "Outlet", sortable: true },
      { key: "sub_total", label: "Subtotal", sortable: false },
      { key: "discount", label: "Diskon", sortable: false },
      { key: "tax", label: "Pajak", sortable: false },
      { key: "total", label: "Total", sortable: false },
      { key: "description", label: "Deskripsi", sortable: false },
      { key: "payment_type", label: "Tipe Bayar", sortable: false },
    ],
    []
  );

  const handleDeleteCartItem = (inventory_id) => {
    const newCart = cartItems.filter(
      (item) => item.inventory_id !== inventory_id
    );
    setCartItems(newCart);
    localStorage.setItem("sale_cart", JSON.stringify(newCart));
    toast.success("Item berhasil dihapus dari keranjang");
  };

  const TABLE_ROWS = useMemo(() => {
    return data.map((item) => ({
      ...item,
      outlet_name: item.outlet?.name || "-",
    }));
  }, [data]);

  //   SAVE PURCHASES
  const handleOpenSaveSale = () => {
    console.log("handleOpenSaveSale");

    if (cartItems.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }
    setIsSaleModalOpen(true);
    console.log("setIsSaleModalOpen " + isSaleModalOpen);
  };

  const handleSaveSale = async () => {
    const payload = {
      outlet_id: outletId,
      date: new Date().toISOString().slice(0, 10),
      reference_number: "PRC/" + Date.now(),
      sub_total: subTotal,
      discount: discountAmount,
      tax: taxAmount,
      total: totalAmount,
      description:
        saleDescription || `Purchasing ${new Date().toLocaleDateString()}`,
      payment_type: paymentType,
      payment: {
        date: new Date().toISOString().slice(0, 10),
        description: "Initial Payment",
        payment_type: paymentType,
        amount: totalAmount,
      },
      items: cartItems.map((item) => ({
        inventory_id: item.inventory_id,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    };

    console.log("Payload sebelum dikirim:", payload);

    try {
      await axios.post(`${baseUrl}/sale`, payload, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Data pembelian berhasil disimpan");
      setCartItems([]);
      localStorage.removeItem("sale_cart");
      fetchSales();
      setIsSaleModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan data pembelian");
    }
  };

  const FILTER = (
    <div className="flex gap-4 mb-4 items-end">
      <GenosSearchSelect
        label="Outlet"
        placeholder="Pilih outlet"
        className="w-64 text-xs"
        options={outlets.map((s) => ({
          value: s.id,
          label: s.name,
        }))}
        value={selectedOutlet}
        onChange={(val) => setSelectedOutlet(val)}
      />
      <GenosTextfield
        label="Cari"
        placeholder="Cari berdasarkan ref# atau deskripsi"
        className="w-full"
        is_icon_left
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    // Mapping data agar rapi di Excel
    const exportData = data.map((item) => ({
      "Reference Number": item.reference_number,
      Tanggal: item.date,
      Outlet: item.outlet?.name || "-",
      Subtotal: item.sub_total,
      Diskon: item.discount,
      Pajak: item.tax,
      Total: item.total,
      Deskripsi: item.description,
      "Tipe Bayar": item.payment_type,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Sale");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `Data-Sale-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="flex gap-4">
      <div className="flex-grow">
        <GenosTable
          TABLE_HEAD={TABLE_HEAD}
          TABLE_ROWS={TABLE_ROWS}
          PAGINATION
          rowsPerPage={limit}
          totalRows={totalItems}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          loading={isLoading}
          FILTER={FILTER}
          onAddData={handleOpen}
          handleExportSelected={exportToExcel}
        />

        {isModalOpen && (
          <GenosModal
            show
            title={
              selectedCart ? "Edit Item Pembelian" : "Tambah Item Pembelian"
            }
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSaveCart}
          >
            <div className="grid grid-cols-1 gap-4 text-xs">
              <GenosSearchSelect
                label="Item"
                placeholder="Pilih item"
                className="w-full"
                options={inventories.map((item) => ({
                  value: item.id,
                  label: `${item.name} - ${item.unit || "-"}`,
                }))}
                value={selectedItem}
                onChange={(itemId) => {
                  console.log(selectedItem);
                  const inv = inventories.find((i) => i.id === itemId);
                  setSelectedItem(itemId);
                  setSelectedInventory(inv);
                  setPrice(inv?.price || 0);
                  setUnit(inv?.unit || "-");
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <GenosTextfield
                  label="Qty"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <GenosTextfield
                  label="Harga"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                />
              </div>

              <div className="text-xs text-gray-600">
                Unit: <span className="font-semibold">{unit}</span>
              </div>

              <hr className="my-2 border-light2" />

              <div className="text-right font-bold">
                Total: Rp {(quantity * price || 0).toLocaleString("id-ID")}
              </div>
            </div>
          </GenosModal>
        )}

        {isSaleModalOpen && (
          <GenosModal
            title="Simpan Pembelian"
            show
            onClose={() => setIsSaleModalOpen(false)}
          >
            <div className="flex flex-col gap-4">
              <GenosSearchSelect
                label="Outlet"
                placeholder="Pilih outlet"
                className="w-full"
                options={outlets.map((s) => ({ value: s.id, label: s.name }))}
                value={outletId}
                onChange={setOutletId}
              />
              <GenosSelect
                label="Payment Type"
                options={[
                  { label: "Cash", value: "cash" },
                  { label: "Transfer", value: "transfer" },
                ]}
                value={paymentType}
                onChange={(e) => {
                  console.log("Event:", e);
                  console.log("Value:", e.target.value);
                  setPaymentType(e.target.value);
                }}
              />

              <GenosTextfield
                label="Deskripsi"
                placeholder="Deskripsi pembelian"
                value={saleDescription}
                onChange={(e) => setSaleDescription(e.target.value)}
              />
              <GenosTextfield
                label="Diskon (%)"
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
              />
              <p className="text-sm text-gray-500">
                Nominal: {discountAmount.toLocaleString()}
              </p>

              <GenosTextfield
                label="Pajak (%)"
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
              />
              <p className="text-sm text-gray-500">
                Nominal: {taxAmount.toLocaleString()}
              </p>

              <hr />

              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <span>{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Diskon</span>
                  <span>-{discountAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak</span>
                  <span>+{taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-1">
                  <span>Total</span>
                  <span>{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleSaveSale}
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Simpan dan Cetak
              </button>
            </div>
          </GenosModal>
        )}
      </div>

      <div className="w-[300px] border border-light2 rounded-lg p-4">
        <div className="flex flex-col gap-3 mt-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Item Pembelian</h3>
            <span className="text-sm text-gray-500">
              {cartItems.length} item
            </span>
          </div>
          <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="py-2 flex justify-between items-center"
              >
                <div>
                  <div className="text-sm font-medium">
                    {item.name} - {item.unit}
                  </div>
                  <div className="text-xs text-gray-500">
                    Kategori: - (opsional)
                  </div>
                </div>
                <div className="text-right text-sm font-medium">
                  <div>
                    {item.quantity} x {item.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    = {item.total.toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCartItem(item.inventory_id)}
                  className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                  aria-label={`Hapus ${item.name}`}
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <hr className="my-3 border-gray-300" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>
              {cartItems
                .reduce((acc, item) => acc + item.total, 0)
                .toLocaleString()}
            </span>
          </div>

          <GenosButton
            label="Proses Penjualan"
            onClick={handleOpenSaveSale}
            className="text-center text-white px-4 py-2 rounded hover:bg-primary-dark"
          ></GenosButton>
        </div>
      </div>
    </div>
  );
};

export default SaleTable;
