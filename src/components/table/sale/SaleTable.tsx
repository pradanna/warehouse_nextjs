import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosModal from "@/components/modal/GenosModal";
import GenosSelect from "@/components/form/GenosSelect";
import { baseUrl, getToken } from "@/app/config/config";
import { toast } from "react-toastify";
import GenosSearchSelect from "@/components/form/GenosSearchSelect";
import { XMarkIcon } from "@heroicons/react/24/outline";
import GenosButton from "@/components/button/GenosButton";
import { createSalePayment, getSales, getSalesById } from "@/lib/api/saleApi";
import { getInventory } from "@/lib/api/inventoryApi";
import { getOutlet } from "@/lib/api/outletApi";
import {
  getOutletFromLocal,
  saveOutletToLocal,
} from "@/lib/localstorage/outletDB";
import {
  clearItemsFromLocal,
  getItemsFromLocal,
  SaleCartItem,
  setItemsToLocal,
} from "@/lib/localstorage/saleCartDB";
import { generateSalePDF } from "@/components/PDF/printSalePDF";
import { generateSaleExcel } from "@/components/excel/printSaleExcel";
import SaleDetailModal from "@/components/form/sale/saleDetail";

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
  const [selectedInventory, setSelectedInventory] = useState<any>(null);
  const [unit, setUnit] = useState("-");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [cartItems, setCartItems] = useState<any>([]);
  const [paymentMetode, setPaymentMetode] = useState("cash");
  const [inventories, setInventories] = useState([]);

  // State tambahan untuk modal simpan sale
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [outletId, setOutletId] = useState<string | null | number>(null);
  const [paymentType, setPaymentType] = useState("cash");
  const [saleDescription, setSaleDescription] = useState("");

  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);

  const subTotal = cartItems.reduce(
    (acc: number, item: any) => acc + item.total,
    0
  );
  const discountAmount = (subTotal * discountPercent) / 100;
  const taxAmount = (subTotal * taxPercent) / 100;
  const totalAmount = subTotal - discountAmount + taxAmount;

  const [isModalOutletOpen, setIsModalOutletOpen] = useState(false);

  const [outletName, setOutletName] = useState<string | null>("");
  const [param, setparam] = useState<string>("");
  const [isFromTambah, setIsFromTambah] = useState(false);
  const [isPaymentMetodModalOpen, setPaymentMetodModalOpen] = useState(false);
  const [dpAmount, setDpAmount] = useState(0);

  const [modalViewId, setModalViewId] = useState<any>();
  const [saleDetail, setSaleDetail] = useState<any>();
  const [isModalViewOpen, setModalViewOpen] = useState(false);

  const [isPayFromDetaildModalOpen, setPayFromDetaildModalOpen] =
    useState(false);

  const [saleId, setSaleId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState(0);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const res = await getSales(currentPage, limit, search, selectedOutlet);

      setData(res.data);
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
        const res = await getInventory(param, 1, 1000);
        // Sesuaikan dengan struktur data dari API
        setInventories(res.data);
      } catch (error) {
        console.error("Gagal memuat inventory:", error);
        toast.error("Gagal memuat data inventory");
      }
    };

    fetchInventories();
  }, []);

  const fetchOutlets = async () => {
    try {
      const res = await getOutlet("", 1, 1000);
      setOutlets(res.data);
    } catch (err) {
      toast.error("Gagal mengambil data outlet");
    }
  };

  const handleOpen = () => {
    const Outlet = getOutletFromLocal();
    setIsFromTambah(true);
    if (!Outlet) {
      setIsModalOutletOpen(true);
    } else {
      setIsModalOpen(true);
    }
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
    const existingCart = getItemsFromLocal();

    if (!selectedItem) {
      toast.error("Item belum dipilih");
      return;
    }

    setIsSaving(true);

    const newItem: SaleCartItem = {
      inventory_id: selectedInventory?.id || "-",
      item_id: selectedItem,
      name: selectedInventory?.item.name || "-",
      unit_id: selectedInventory?.unit.id || "-",
      unit_name: selectedInventory?.unit.name || "-",
      quantity: quantity,
      price,
      total: quantity * price,
    };

    console.log("newItem:", newItem);

    const itemIndex = existingCart.findIndex(
      (item) => item.inventory_id === newItem.inventory_id
    );

    if (itemIndex !== -1) {
      // Jika sudah ada, update
      existingCart[itemIndex] = newItem;
    } else {
      // Jika belum ada, tambahkan
      existingCart.push(newItem);
    }

    setItemsToLocal(existingCart);

    setSelectedInventory(null);
    setQuantity(1);
    setPrice(0);

    toast.success("Item berhasil ditambahkan ke cart");
    handleClose();
    setCartItems(getItemsFromLocal());
    setIsSaving(false);
  };

  useEffect(() => {
    setCartItems(getItemsFromLocal());
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

  const handleDeleteCartItem = (inventory_id: string | number) => {
    const existingCart = getItemsFromLocal();

    const updatedCart = existingCart.filter(
      (item) => item.inventory_id !== inventory_id
    );

    setItemsToLocal(updatedCart); // update localStorage
    setCartItems(updatedCart); // update state
    toast.success("Item berhasil dihapus dari keranjang");
  };

  const TABLE_ROWS = useMemo(() => {
    return data.map((item: any) => ({
      ...item,
      outlet_name: item.outlet?.name || "-",
    }));
  }, [data]);

  const gotoPaymentMetod = () => {
    setPaymentMetodModalOpen(true);
  };

  // LIHAT DETAIL
  const handleView = async (id: any) => {
    setModalViewId(id);
    try {
      const response = await getSalesById(id);
      if (response === undefined) {
        toast.error("Gagal mengambil data penjualan");
      } else {
        setModalViewOpen(true);

        setSaleDetail(response);
        console.log("Response dari API:", response);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data penjualan");
    }
  };

  //   SAVE saleS
  const handleOpenSaveSale = () => {
    console.log("handleOpenSaveSale");

    if (cartItems.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }
    setIsSaleModalOpen(true);
    console.log("setIsSaleModalOpen " + isSaleModalOpen);
  };

  const handleSetOutlet = () => {
    console.log("handleSetOutlet");

    const selectedOutlet = outlets.find((s: any) => s.id === outletId) as any;

    if (!selectedOutlet) return;

    const savedOutlet = getOutletFromLocal();

    // Jika outlet sebelumnya berbeda, munculkan konfirmasi
    if (savedOutlet && savedOutlet.id !== selectedOutlet.id) {
      const confirmChange = window.confirm(
        "Mengganti outlet akan menghapus semua item di keranjang. Lanjutkan?"
      );

      if (!confirmChange) return;

      clearItemsFromLocal();
      setCartItems([]);
    }

    saveOutletToLocal(selectedOutlet.id, selectedOutlet.name);

    const newSavedOutlet = getOutletFromLocal();
    if (newSavedOutlet) {
      setOutletName(newSavedOutlet.name);
    }

    setIsModalOutletOpen(false);

    if (isFromTambah) {
      setIsModalOpen(true);
    }
  };

  const handleSaveSale = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const isInstallment = paymentType === "installment";

    // Misal kamu bisa atur nilai DP secara manual atau pakai default 30% dari total
    const downPayment = isInstallment ? dpAmount : totalAmount;

    const payload = {
      outlet_id: outletId,
      date: today,
      reference_number: "PRC/" + Date.now(),
      sub_total: subTotal,
      discount: discountAmount,
      tax: taxAmount,
      total: totalAmount,
      description:
        saleDescription || `Penjualan ${new Date().toLocaleDateString()}`,
      payment_type: paymentType,
      payment: {
        date: new Date().toISOString().slice(0, 10),
        description: isInstallment ? "Down Payment" : "Full Payment",
        payment_type: paymentMetode,
        amount: downPayment,
      },
      items: cartItems.map((item: any) => ({
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
      toast.success("Data Penjualan berhasil disimpan");
      setCartItems([]);
      clearItemsFromLocal();
      fetchSales();
      setIsSaleModalOpen(false);
      setPaymentMetodModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan data penjualan");
    }
  };

  const FILTER = (
    <div className="flex gap-4 mb-4 items-end">
      <GenosSearchSelect
        label="Outlet"
        placeholder="Pilih outlet"
        className="w-64 text-xs"
        options={outlets.map((s: any) => ({
          value: s.id,
          label: s.name,
        }))}
        value={selectedOutlet}
        onChange={(val: any) => setSelectedOutlet(val)}
      />
      <GenosTextfield
        id="search"
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
    const exportData = data.map((item: any) => ({
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
  };

  const handleChangeOutlet = () => {
    setIsFromTambah(false);
    setIsModalOutletOpen(true);
  };

  // AMBIL DATA SUPPLIER
  useEffect(() => {
    const outlet = getOutletFromLocal();
    if (outlet) {
      setOutletId(outlet.id);
      setOutletName(outlet.name);
    }
  }, []);

  const handleDownloadPDF = () => {
    generateSalePDF(saleDetail);
  };

  const handleDownloadExcel = () => {
    generateSaleExcel(saleDetail);
  };

  const handleSavePayCredit = async () => {
    const today = new Date().toISOString().slice(0, 10);

    const payload = {
      sale_id: saleId,
      date: today,
      description: "Installments / Pembayaran Tempo",
      payment_type: paymentMetode,
      amount: payAmount,
    };

    console.log("Payload sebelum dikirim:", payload);

    try {
      const response = await createSalePayment(payload);
      console.log("Response dari API:", response);

      if (response.success === false) {
        if (response.message) {
          toast.error(response.message);
        } else {
          toast.error("Gagal melakukan pembayaran");
        }
      } else {
        toast.success("Data penjualan berhasil disimpan");

        handleView(saleId);
        setPayFromDetaildModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal melakukan pembayaran");
    }
  };

  const gotoDetailPayment = () => {
    setPayAmount(
      saleDetail.data.total -
        saleDetail.data.payments.reduce(
          (acc: number, cur: any) => acc + cur.amount,
          0
        )
    );
    setPayFromDetaildModalOpen(true);
  };

  const closeDetailPayment = () => {
    setPayFromDetaildModalOpen(false);
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
          ACTION_BUTTON={{
            view: (row) => {
              setSaleId(row.id);
              handleView(row.id);
            },
          }}
        />

        {isModalOpen && (
          <GenosModal
            show
            title={
              selectedCart ? "Edit Item Penjualan" : "Tambah Item Penjualan"
            }
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSaveCart}
          >
            <div className="grid grid-cols-1 gap-4 text-xs">
              <GenosSearchSelect
                label="Item"
                placeholder="Pilih item"
                className="w-full"
                options={inventories.map((inv: any) => ({
                  value: inv.item.id,
                  label: `${inv.item.name} - ${inv.unit.name || "-"}`,
                }))}
                value={selectedItem}
                onChange={(itemId: any) => {
                  const inv = inventories.find(
                    (i: any) => i.item.id === itemId
                  ) as any;
                  console.log("INV", inv);
                  console.log("inv.item.name", inv.item.name);
                  setSelectedItem(itemId);
                  setSelectedInventory(inv);
                  console.log("outlet id: " + outletId);
                  const selectedPrice = inv?.prices?.find(
                    (p: any) => p.outlet?.id === outletId
                  );

                  console.log("Selected Price Object: ", selectedPrice);

                  setPrice(selectedPrice?.price || 0);
                  // setUnit(inv?.unit.name || "-");
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <GenosTextfield
                  id="tambah-qty"
                  label="Qty"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <GenosTextfield
                  id="tambah-price"
                  label="Harga"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                />
              </div>

              <div className="text-right font-bold">
                Total: Rp {(quantity * price || 0).toLocaleString("id-ID")}
              </div>
            </div>
          </GenosModal>
        )}

        {isSaleModalOpen && (
          <GenosModal
            title="Simpan Penjualan"
            show
            onClose={() => setIsSaleModalOpen(false)}
            withCloseButton={false}
            size="lg"
          >
            <div className="flex flex-col gap-4">
              <GenosSelect
                label="Jenis Pembayaran"
                options={[
                  { label: "Bayar Lunas", value: "cash" },
                  { label: "Tempo", value: "installment" },
                ]}
                value={paymentType}
                onChange={(e) => {
                  console.log("Event:", e);
                  console.log("Value:", e.target.value);
                  setPaymentType(e.target.value);
                }}
              />

              <GenosTextfield
                id="tambah-sale-description"
                label="Deskripsi"
                placeholder="Deskripsi penjualan"
                value={saleDescription}
                onChange={(e) => setSaleDescription(e.target.value)}
              />
              <GenosTextfield
                id="tambah-sale-discount"
                label="Diskon (%)"
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
              />
              <p className="text-sm text-gray-500">
                Nominal: {discountAmount.toLocaleString()}
              </p>

              <GenosTextfield
                id="tambah-sale-tax"
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
                onClick={gotoPaymentMetod}
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Simpan
              </button>
            </div>
          </GenosModal>
        )}

        {/* MODAL METODE PEMBAYARAN */}
        {isPaymentMetodModalOpen && (
          <GenosModal
            show
            title={"Pembayaran"}
            onClose={() => setPaymentMetodModalOpen(false)}
            onSubmit={handleSaveSale}
          >
            <GenosSelect
              label="Metode Pembayaran"
              options={[
                { label: "Cash", value: "cash" },
                { label: "Digital", value: "digital" },
              ]}
              value={paymentMetode}
              onChange={(e) => {
                console.log("Event:", e);
                console.log("Value:", e.target.value);
                setPaymentMetode(e.target.value);
              }}
              className="mb-5"
            />
            <GenosTextfield
              id="tambah-sale-dp"
              label="Jumlah Pembayaran"
              type="number"
              value={paymentType === "cash" ? totalAmount : dpAmount}
              disabled={paymentType === "cash"}
              onChange={(e) => {
                if (paymentType === "installment") {
                  setDpAmount(Number(e.target.value));
                }
              }}
            />
          </GenosModal>
        )}

        {/* MODAL PILIH OUTLET */}
        {isModalOutletOpen && (
          <GenosModal
            show
            title={"Pilih Outlet"}
            onClose={() => setIsModalOutletOpen(false)}
            onSubmit={handleSetOutlet}
          >
            <GenosSearchSelect
              label="Outlet"
              placeholder="Pilih outlet"
              className="w-full"
              options={outlets.map((s: any) => ({
                value: s.id,
                label: s.name,
              }))}
              value={outletId}
              onChange={setOutletId}
            />
          </GenosModal>
        )}

        {/* MODAL DETAIL / VIEW */}
        {isModalViewOpen && (
          <SaleDetailModal
            show={isModalViewOpen}
            onClose={() => setModalViewOpen(false)}
            saleDetail={saleDetail}
            handleDownloadPDF={handleDownloadPDF}
            handleDownloadExcel={handleDownloadExcel}
            gotoDetailPayment={gotoDetailPayment}
            saleId={saleId}
            handleView={() => handleView(saleId)}
            isPayFromDetaildModalOpen={isPayFromDetaildModalOpen}
            setPayFromDetaildModalOpen={setPayFromDetaildModalOpen}
            payAmount={payAmount}
            setPayAmount={setPayAmount}
          />
        )}
      </div>

      <div className="w-[300px] border border-light2 rounded-lg p-4">
        <div className="flex flex-col gap-3 mt-3">
          {outletName && (
            <div className="flex items-center justify-between p-2 border border-gray-200 rounded bg-gray-50 mb-3">
              <div>
                <p className="text-xs text-gray-500">Outlet</p>
                <p className="font-semibold text-gray-800">{outletName}</p>
              </div>
              <button
                type="button"
                onClick={handleChangeOutlet} // ganti dengan fungsi yang kamu punya
                className="text-gray-400 hover:text-red-500 text-lg font-bold px-2 cursor-pointer"
              >
                &times;
              </button>
            </div>
          )}
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Item Penjualan</h3>
            <span className="text-sm text-gray-500">
              {cartItems.length} item
            </span>
          </div>
          <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
            {cartItems.map((item: any, index: number) => (
              <div
                key={index}
                className="py-2 flex justify-between items-center"
              >
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.unit_name}</div>
                </div>
                <div className="flex  gap-2">
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
              </div>
            ))}
          </div>
          <hr className="my-3 border-gray-300" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>
              {cartItems
                .reduce((acc: number, item: any) => acc + item.total, 0)
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
