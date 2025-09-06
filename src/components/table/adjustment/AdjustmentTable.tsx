import { useEffect, useMemo, useState } from "react";
import GenosTable from "../GenosTable";
import { toast } from "react-toastify";
import GenosModal from "@/components/modal/GenosModal";
import { formatTanggalIndo } from "@/lib/helper";
import GenosDropdown from "@/components/button/GenosDropdown";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { getPurchasesById } from "@/lib/api/purchaseApi";
import { generatePurchasePDF } from "@/components/PDF/printPurchasePDF";
import { generatePurchaseExcel } from "@/components/excel/printPurchaseExcel";
import {
  createAdjustment,
  getAdjustment,
  getAdjustmentById,
} from "@/lib/api/adjustmentApi";
import GenosSelect from "@/components/form/GenosSelect";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosSearchSelect from "@/components/form/GenosSearchSelect";
import { getInventory } from "@/lib/api/inventory/inventoryApi";
import dayjs from "dayjs";

const AdjustmentTable = () => {
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [debtData, setAdjustmentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [qty, setQty] = useState<string | number>(0);
  const [deskripsi, setDeskripsi] = useState<string>("");
  const [param, setparam] = useState<string>("");
  const [totalSisaAdjustment, setTotalSisaAdjustment] = useState(0);

  const [modalViewId, setModalViewId] = useState<any>();
  const [isModalViewOpen, setModalViewOpen] = useState(false);
  const [debtDetail, setAdjustmentDetail] = useState<any>();
  const [purchaseDetail, setPurchaseDetail] = useState<any>();
  const [isModalAddOpen, setModalAddOpen] = useState(false);

  const [inventories, setInventories] = useState<any>();
  const [selectedItem, setSelectedItem] = useState<any>();
  const [selectedInventory, setSelectedInventory] = useState<any>();

  const TABLE_HEAD = useMemo(
    () => [
      { key: "item.name", label: "Nama Barang", sortable: true, type: "text" },

      {
        key: "unit.name",
        label: "Satuan",
        sortable: false,
        type: "text",
      },
      {
        key: "type",
        label: "Tipe Penyesuaian",
        sortable: false,
        type: "text",
      },
      {
        key: "date",
        label: "Tanggal",
        sortable: true,
        type: "text",
      },
      {
        key: "author.username",
        label: "user",
        sortable: true,
        type: "text",
      },
    ],
    []
  );

  const FetchAdjustment = async () => {
    setIsLoadingTable(true);

    try {
      const res = await getAdjustment(currentPage, limit, search, type);
      setAdjustmentData(res.data);
      setTABLE_ROWS(res.data);
      setTotalItems(res.total);
    } catch (err) {
      console.log(err);
    }

    setIsLoadingTable(false);
  };

  useEffect(() => {
    FetchAdjustment();
  }, []);

  useEffect(() => {
    if (purchaseDetail) {
      console.log("Purchase detail updated:", purchaseDetail);
    }
  }, [purchaseDetail]);

  const handleView = async (id: any) => {
    setModalViewId(id);
    try {
      const response = await getAdjustmentById(id);
      if (response === undefined) {
        toast.error("Gagal mengambil data pembelian");
      } else {
        try {
          const responsePurchase = await getPurchasesById(
            response.data.purchase.id
          );
          setModalViewOpen(true);
          setPurchaseDetail(responsePurchase);

          console.log(purchaseDetail);
        } catch (err) {
          console.log(err);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data pembelian");
    }
  };

  const handleDownloadPDF = () => {
    generatePurchasePDF(purchaseDetail);
  };

  const handleDownloadExcel = () => {
    generatePurchaseExcel(purchaseDetail);
  };

  const handleOpenModalAdd = () => {
    setModalAddOpen(true);
  };

  const handleSavePurchase = async () => {
    const payload = {
      inventory_id: selectedInventory.id,
      type,
      quantity: qty,
      deskripsi,
      date: dayjs().format("YYYY-MM-DD"),
    };

    console.log("Payload:", payload);

    try {
      const res = await createAdjustment(payload);

      console.log("Response:", res);

      if (res !== undefined) {
        toast.success("Penyesuaian berhasil disimpan", {
          autoClose: 1000,
        });
      } else {
        toast.error("Penyesuaian gagal disimpan", {
          autoClose: 1000,
        });
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err, {
        autoClose: 1000,
      });
    }
  };

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const res = await getInventory(param, 1, 1000);
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
        loading={isLoadingTable}
        ACTION_BUTTON={{
          view: (row) => handleView(row.id),
        }}
        onAddData={handleOpenModalAdd}
        FILTER
      ></GenosTable>

      {isModalAddOpen && (
        <GenosModal
          show
          title={"Pembayaran"}
          onClose={() => setModalAddOpen(false)}
          onSubmit={handleSavePurchase}
        >
          <GenosSearchSelect
            label="Item"
            placeholder="Pilih item"
            className="w-full mb-5"
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

          <GenosSelect
            label="Tipe Penyesuaian"
            options={[
              { label: "IN", value: "in" },
              { label: "OUT", value: "in" },
            ]}
            value={type}
            onChange={(e) => {
              console.log("Event:", e);
              console.log("Value:", e.target.value);
              setType(e.target.value);
            }}
            className="mb-5"
          />
          <GenosTextfield
            id="jumlah-barang"
            label="Jumlah barang "
            type="number"
            className="mb-5"
            value={qty}
            onChange={(e) => {
              setQty(e.target.value);
            }}
          />

          <GenosTextfield
            id="deskripsi-barang"
            label="Deskripsi "
            type="text"
            value={deskripsi}
            onChange={(e) => {
              setDeskripsi(e.target.value);
            }}
          />
        </GenosModal>
      )}

      {/* Modal View Detail Pembelian */}
      {isModalViewOpen && (
        <GenosModal
          show
          title="Detail Pembelian"
          onClose={() => setModalViewOpen(false)}
          size="xl2"
          withCloseButton={false}
        >
          {/* Header Info */}
          <div className="flex flex-col md:flex-row justify-between align-bottom gap-4 mb-4">
            <div className=" p-4 rounded-md w-full md:w-auto flex-1">
              <p className="text-xs font-light">Nomor Referensi</p>
              <p className="text-lg font-bold">
                {purchaseDetail.data.reference_number}
              </p>
            </div>

            <div className="flex flex-col  justify-end align-bottom">
              <GenosDropdown
                iconLeft={<PrinterIcon className="w-5 h-5" />}
                round="md"
                color="gray"
                outlined
                align="right"
                options={[
                  {
                    label: "Download PDF",
                    icon: <i className="fa-regular fa-file-pdf text-red-500" />,
                    onClick: () => handleDownloadPDF(),
                  },
                  {
                    label: "Download Excel",
                    icon: (
                      <i className="fa-regular fa-file-excel text-green-500" />
                    ),
                    onClick: () => handleDownloadExcel(),
                  },
                ]}
              />
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm text-gray-600 mb-5">
            {/* Deskripsi (8 cols) */}
            <div className="md:col-span-2 bg-white border border-gray-200 p-4 rounded-md">
              <p className="text-xs font-light">Tanggal Pembelian</p>
              <p className="font-bold">
                {formatTanggalIndo(purchaseDetail.data.date)}
              </p>
            </div>
            <div className="md:col-span-6 bg-white border border-gray-200 p-4 rounded-md">
              <p className="font-medium text-xs">Deskripsi</p>
              <p className="font-bold">{purchaseDetail.data.description}</p>
            </div>

            {/* Supplier (4 cols) */}
            <div className="md:col-span-4 bg-white border border-gray-200 p-4 rounded-md">
              <p className="font-medium text-xs">Supplier</p>
              <p className="font-bold">{purchaseDetail.data.supplier?.name}</p>
            </div>

            {/* Daftar Item (8 cols) */}
            <div className="md:col-span-8 bg-white border border-gray-200 p-4 rounded-md">
              <h2 className="text-md font-semibold text-gray-700 mb-2">
                Daftar Item
              </h2>
              <hr className="my-4 border-gray-200" />
              <div className="overflow-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-gray-700 font-medium">
                    <tr>
                      <th className="p-2">Nama</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2">Unit</th>
                      <th className="p-2">Harga</th>
                      <th className="p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseDetail.data.items.map(
                      (item: any, index: number) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="p-2 font-bold text-xs">{item.name}</td>
                          <td className="p-2 text-xs">{item.quantity}</td>
                          <td className="p-2 text-xs">{item.unit}</td>
                          <td className="p-2 text-xs">
                            Rp {item.price.toLocaleString("id-ID")}
                          </td>
                          <td className="p-2 text-xs">
                            Rp {item.total.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Jenis Pembayaran + Ringkasan (4 cols) */}
            <div className="md:col-span-4 flex flex-col gap-4">
              {/* Jenis Pembayaran */}
              <div className="bg-white border border-gray-200 p-4 rounded-md">
                <p className="font-medium text-xs">Jenis Pembayaran</p>
                <p className="font-bold">{purchaseDetail.data.payment_type}</p>
              </div>

              {/* Ringkasan */}
              <div className="bg-white border border-gray-200 p-4 rounded-md">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Ringkasan
                </p>
                <div className="flex justify-between">
                  <span className="text-xs">Sub Total</span>
                  <span className="text-xs">
                    Rp {purchaseDetail.data.sub_total.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Diskon</span>
                  <span className="text-xs">
                    Rp {purchaseDetail.data.discount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Pajak</span>
                  <span className="text-xs">
                    Rp {purchaseDetail.data.tax.toLocaleString("id-ID")}
                  </span>
                </div>
                <hr className="my-4 border-gray-200" />
                <div className="flex justify-between font-semibold text-green-700 mt-2 text-lg">
                  <span>Total</span>
                  <span>
                    Rp {purchaseDetail.data.total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Pembayaran History (Full) */}
            <div className="md:col-span-12 bg-white border border-gray-200 p-4 rounded-md">
              <h2 className="text-md font-semibold text-gray-700 mb-2">
                Pembayaran{" "}
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    purchaseDetail.data.payment_status === "paid"
                      ? "bg-green-100 text-green-700"
                      : purchaseDetail.data.payment_status === "partial"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {purchaseDetail.data.payment_status}
                </span>
              </h2>
              <hr className="my-4 border-gray-200" />
              <table className="w-full text-sm text-left">
                <thead className="text-gray-700 font-medium">
                  <tr>
                    <th className="p-2">Tanggal</th>
                    <th className="p-2">Jumlah</th>
                    <th className="p-2">Deskripsi</th>
                    <th className="p-2">Metode Pembayaran</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseDetail.data.payments.map(
                    (payment: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="p-2 text-sm">{payment.date}</td>
                        <td className="p-2 text-sm">
                          Rp {payment.amount.toLocaleString("id-ID")}
                        </td>
                        <td className="p-2 text-sm">{payment.description}</td>
                        <td className="p-2 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              payment.payment_type === "digital"
                                ? "bg-blue-100 text-blue-700"
                                : payment.payment_type === "cash"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {payment.payment_type}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </GenosModal>
      )}
    </>
  );
};
export default AdjustmentTable;
