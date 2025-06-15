import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosModal from "@/components/modal/GenosModal";
import GenosSelect from "@/components/form/GenosSelect";
import { baseUrl, getToken } from "@/app/config/config";
import { toast } from "react-toastify";
import GenosSearchSelect from "../../form/GenosSearchSelect";
import { XMarkIcon } from "@heroicons/react/24/solid";
import GenosButton from "../../button/GenosButton";
import { getInventory } from "@/lib/api/inventoryApi";
import {
  createPurchasePayment,
  createPurchases,
  getPurchases,
  getPurchasesById,
} from "@/lib/api/purchaseApi";
import { getSupplier } from "@/lib/api/supplierApi";
import {
  clearSupplierFromLocal,
  getSupplierFromLocal,
  saveSupplierToLocal,
} from "@/lib/localstorage/supplierDB";
import {
  PurchaseCartItem,
  clearItemsFromLocal,
  getItemsFromLocal,
  setItemsToLocal,
} from "@/lib/localstorage/purchaseCartDB";
import { formatTanggalIndo } from "@/lib/helper";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import GenosDropdown from "@/components/button/GenosDropdown";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { generatePurchasePDF } from "@/components/PDF/printPurchasePDF";
import { generatePurchaseExcel } from "@/components/excel/printPurchaseExcel";
import PurchaseDetailModal from "@/components/form/purchase/purchaseDetail";

const PurchaseTable = () => {
  const [data, setData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSupplierOpen, setIsModalSupplierOpen] = useState(false);
  const [selectedCart, setSelectedCart] = useState<null | any>(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedInventory, setSelectedInventory] = useState<null | any>(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [cartItems, setCartItems] = useState<any>([]);

  const [inventories, setInventories] = useState([]);

  // State tambahan untuk modal simpan purchase
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isPaymentMetodModalOpen, setPaymentMetodModalOpen] = useState(false);
  const [isPayFromDetaildModalOpen, setPayFromDetaildModalOpen] =
    useState(false);
  const [isModalViewOpen, setModalViewOpen] = useState(false);
  const [modalViewId, setModalViewId] = useState<any>();
  const [supplierId, setSupplierId] = useState<string | null | number>(null);
  const [paymentType, setPaymentType] = useState("cash");
  const [paymentMetode, setPaymentMetode] = useState("cash");
  const [purchaseDescription, setPurchaseDescription] = useState("");
  const [purchaseDetail, setPurchaseDetail] = useState<any>();

  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);

  const subTotal = cartItems.reduce(
    (acc: number, item: any) => acc + item.total,
    0
  );
  const discountAmount = (subTotal * discountPercent) / 100;
  const taxAmount = (subTotal * taxPercent) / 100;
  const totalAmount = subTotal - discountAmount + taxAmount;
  const [dpAmount, setDpAmount] = useState(0);
  const [payAmount, setPayAmount] = useState(0);
  const [supplierName, setSupplierName] = useState<string | null>("");
  const [isFromTambah, setIsFromTambah] = useState(false);

  const [purchaseId, setPurchaseId] = useState<string | null>(null);

  const fetchPurchases = async () => {
    setIsLoading(true);
    try {
      const res = await getPurchases(
        currentPage,
        limit,
        search,
        selectedSupplier
      );

      setData(res.data);
      setTotalItems(res.total);
    } catch (err) {
      toast.error("Gagal mengambil data purchase");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const res = await getInventory(1, 1000);
        // Sesuaikan dengan struktur data dari API
        setInventories(res.data);
        console.log("Inventories:", res.data);
      } catch (error) {
        console.error("Gagal memuat inventory:", error);
        toast.error("Gagal memuat data inventory");
      }
    };

    fetchInventories();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await getSupplier("", 1, 1000);
      setSuppliers(res.data);
    } catch (err) {
      toast.error("Gagal mengambil data supplier");
    }
  };

  const handleOpen = () => {
    const supplier = getSupplierFromLocal();
    setIsFromTambah(true);
    if (!supplier) {
      setIsModalSupplierOpen(true);
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
    setSelectedCart(null);
  };

  useEffect(() => {
    fetchPurchases();
  }, [currentPage, limit, search, selectedSupplier]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSaveCart = () => {
    const existingCart = getItemsFromLocal();

    if (!selectedItem) {
      toast.error("Item belum dipilih");
      return;
    }

    setIsSaving(true);

    const newItem: PurchaseCartItem = {
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
      { key: "supplier_name", label: "Supplier", sortable: true },
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
      supplier_name: item.supplier?.name || "-",
    }));
  }, [data]);

  //   SAVE PURCHASES
  const handleOpenSavePurchase = () => {
    console.log("handleOpenSavePurchase");

    if (cartItems.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }
    setIsPurchaseModalOpen(true);
    console.log("setIsPurchaseModalOpen " + isPurchaseModalOpen);
  };

  const handleSavePurchase = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const isInstallment = paymentType === "installment";

    // Misal kamu bisa atur nilai DP secara manual atau pakai default 30% dari total
    const downPayment = isInstallment ? dpAmount : totalAmount;

    const payload = {
      supplier_id: supplierId,
      date: today,
      reference_number: "PRC/" + Date.now(),
      sub_total: subTotal,
      discount: discountAmount,
      tax: taxAmount,
      total: totalAmount,
      description:
        purchaseDescription || `Purchasing ${new Date().toLocaleDateString()}`,
      payment_type: paymentType,
      payment: {
        date: today,
        description: isInstallment ? "Down Payment" : "Full Payment",
        payment_type: paymentMetode,
        amount: downPayment,
      },
      items: cartItems.map((item: any) => ({
        inventory_id: item.inventory_id,
        unit_id: item.unitId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    };

    console.log("Payload sebelum dikirim:", payload);

    try {
      const response = await createPurchases(payload);
      console.log("Response dari API:", response);

      if (response === undefined) {
        toast.error("Gagal menyimpan data pembelian");
      } else {
        toast.success("Data pembelian berhasil disimpan");
        setCartItems([]);
        clearItemsFromLocal();
        clearSupplierFromLocal();
        setSupplierName(null);
        setIsPurchaseModalOpen(false);
        fetchPurchases();
        setPaymentMetodModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan data pembelian");
    }
  };

  const handleSetSupplier = () => {
    console.log("handleSetSupplier");

    const selectedSupplier = suppliers.find(
      (s: any) => s.id === supplierId
    ) as any;
    if (selectedSupplier) {
      saveSupplierToLocal(selectedSupplier.id, selectedSupplier.name);

      const savedSupplier = getSupplierFromLocal();
      if (savedSupplier) {
        setSupplierName(savedSupplier.name);
      }
    }
    setIsModalSupplierOpen(false);

    if (isFromTambah) {
      setIsModalOpen(true);
    }
  };

  const handleDownloadPDF = () => {
    generatePurchasePDF(purchaseDetail);
  };

  const handleDownloadExcel = () => {
    generatePurchaseExcel(purchaseDetail);
  };

  const FILTER = (
    <div className="flex gap-4 mb-4 items-end">
      <GenosSearchSelect
        label="Supplier"
        placeholder="Pilih supplier"
        className="w-64 text-xs"
        options={suppliers.map((s: any) => ({
          value: s.id,
          label: s.name,
        }))}
        value={selectedSupplier}
        onChange={(val: any) => setSelectedSupplier(val)}
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

  const handleChangeSupplier = () => {
    setIsFromTambah(false);
    setIsModalSupplierOpen(true);
  };

  const gotoPaymentMetod = () => {
    setPaymentMetodModalOpen(true);
  };

  const gotoDetailPayment = () => {
    setPayAmount(
      purchaseDetail.data.total -
        purchaseDetail.data.payments.reduce(
          (acc: number, cur: any) => acc + cur.amount,
          0
        )
    );
    setPayFromDetaildModalOpen(true);
  };

  const closeDetailPayment = () => {
    setPayFromDetaildModalOpen(false);
  };

  // AMBIL DATA SUPPLIER
  useEffect(() => {
    const supplier = getSupplierFromLocal();
    if (supplier) {
      setSupplierId(supplier.id);
      setSupplierName(supplier.name);
    }
  }, []);

  // SET DP TO TOTAL JIKA PEMBAYARAN LUNAS
  useEffect(() => {
    if (paymentType === "cash") {
      setDpAmount(totalAmount);
    }
  }, [paymentType, totalAmount]);

  // LIHAT DETAIL
  const handleView = async (id: any) => {
    setModalViewId(id);
    try {
      const response = await getPurchasesById(id);
      if (response === undefined) {
        toast.error("Gagal mengambil data pembelian");
      } else {
        setModalViewOpen(true);

        setPurchaseDetail(response);
        console.log("Response dari API:", response);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data pembelian");
    }
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
              handleView(row.id), setPurchaseId(row.id);
            },
          }}
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
                options={inventories.map((inv: any) => ({
                  value: inv.item.id,
                  label: `${inv.item.name} - ${inv.unit.name || "-"}`,
                }))}
                value={selectedItem}
                onChange={(itemId: any) => {
                  console.log("selectedItem " + selectedItem);
                  console.log("itemId " + itemId);

                  console.log("Semua ID inventories:");
                  inventories.forEach((i: any) => console.log(i.item.id));

                  console.log("ItemId yang dicari:", itemId);

                  const inv = inventories.find(
                    (i: any) => i.item.id === itemId
                  ) as any;
                  console.log("INV", inv);
                  console.log("inv.item.name", inv.item.name);
                  setSelectedItem(itemId);
                  setSelectedInventory(inv);

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
                  id="tambah-harga"
                  label="Harga"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                />
              </div>

              <div className="w-full bg-green-100 text-right p-4">
                <span className="text-green-700 font-bold text-lg">
                  Total: Rp {(quantity * price || 0).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </GenosModal>
        )}

        {isPurchaseModalOpen && (
          <GenosModal
            title="Simpan Pembelian"
            show
            onClose={() => setIsPurchaseModalOpen(false)}
            withCloseButton={false}
            size="lg"
          >
            <div className="flex flex-col gap-4">
              <GenosSelect
                label="Jenis Pembayaran"
                options={[
                  { label: "Bayar Lunas", value: "cash" },
                  { label: "Cicilan", value: "installment" },
                ]}
                value={paymentType}
                onChange={(e) => {
                  console.log("Event:", e);
                  console.log("Value:", e.target.value);
                  setPaymentType(e.target.value);
                }}
              />

              <GenosTextfield
                id="tambah-purchase-description"
                label="Deskripsi"
                placeholder="Deskripsi pembelian"
                value={purchaseDescription}
                onChange={(e) => setPurchaseDescription(e.target.value)}
              />
              <GenosTextfield
                id="tambah-purchase-discount"
                label="Diskon (%)"
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
              />
              <p className="text-sm text-gray-500">
                Nominal: {discountAmount.toLocaleString()}
              </p>

              <GenosTextfield
                id="tambah-purchase-tax"
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
      </div>

      {/* MODAL PILIH SUPPLIER */}
      {isModalSupplierOpen && (
        <GenosModal
          show
          title={"Pilih Supplier"}
          onClose={() => setIsModalSupplierOpen(false)}
          onSubmit={handleSetSupplier}
        >
          <GenosSearchSelect
            label="Supplier"
            placeholder="Pilih supplier"
            className="w-full"
            options={suppliers.map((s: any) => ({
              value: s.id,
              label: s.name,
            }))}
            value={supplierId}
            onChange={setSupplierId}
          />
        </GenosModal>
      )}

      {/* MODAL DETAIL / VIEW */}
      {isModalViewOpen && (
        <PurchaseDetailModal
          show
          onClose={() => setModalViewOpen(false)}
          purchaseDetail={purchaseDetail}
          handleDownloadPDF={handleDownloadPDF}
          handleDownloadExcel={handleDownloadExcel}
          gotoDetailPayment={gotoDetailPayment}
          purchaseId={purchaseId}
          handleView={() => handleView(purchaseId)}
          isPayFromDetaildModalOpen={isPayFromDetaildModalOpen}
          setPayFromDetaildModalOpen={setPayFromDetaildModalOpen}
          payAmount={payAmount}
          setPayAmount={setPayAmount}
        />
      )}

      {/* MODAL METODE PEMBAYARAN */}
      {isPaymentMetodModalOpen && (
        <GenosModal
          show
          title={"Pembayaran"}
          onClose={() => setPaymentMetodModalOpen(false)}
          onSubmit={handleSavePurchase}
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
            id="tambah-purchase-dp"
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

      <div className="w-[300px] border border-light2 rounded-lg p-4">
        <div className="flex flex-col gap-3 mt-3">
          {supplierName && (
            <div className="flex items-center justify-between p-2 border border-gray-200 rounded bg-gray-50 mb-3">
              <div>
                <p className="text-xs text-gray-500">Supplier</p>
                <p className="font-semibold text-gray-800">{supplierName}</p>
              </div>
              <button
                type="button"
                onClick={handleChangeSupplier} // ganti dengan fungsi yang kamu punya
                className="text-gray-400 hover:text-red-500 text-lg font-bold px-2 cursor-pointer"
              >
                &times;
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Item Pembelian</h3>

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
            onClick={handleOpenSavePurchase}
            className="text-center text-white px-4 py-2 rounded hover:bg-primary-dark"
          ></GenosButton>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTable;
