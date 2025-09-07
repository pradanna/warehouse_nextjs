import { useEffect, useMemo, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { toast } from "react-toastify";
import { getPurchases, getPurchasesById } from "@/lib/api/purchaseApi";
import GenosDropdown from "@/components/button/GenosDropdown";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { generatePurchasePDF } from "@/components/PDF/printPurchasePDF";
import { generatePurchaseExcel } from "@/components/excel/printPurchaseExcel";
import PurchaseDetailModal from "@/components/form/purchase/purchaseDetail";
import { generatePurchaseListPDF } from "@/components/PDF/printPurchaseListPDF";
import { generatePurchaseListExcel } from "@/components/excel/printPurchaseListExcel";
import dayjs from "dayjs";
import GenosSelect from "@/components/form/GenosSelect";
import GenosDatepicker from "@/components/form/GenosDatepicker";
import GenosSearchSelectSupplier from "@/components/select-search/SupplierSearch";
import { dateRange } from "@/lib/helper";
import { useDebounce } from "@/lib/utils/useDebounce";

const PurchaseTableReport = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [cartItems, setCartItems] = useState<any>([]);

  // State tambahan untuk modal simpan purchase

  const [isPayFromDetaildModalOpen, setPayFromDetaildModalOpen] =
    useState(false);
  const [isModalViewOpen, setModalViewOpen] = useState(false);

  const [purchaseDetail, setPurchaseDetail] = useState<any>();

  const [payAmount, setPayAmount] = useState(0);

  const [purchaseId, setPurchaseId] = useState<string | null>(null);

  // FILTER
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState<Date | null>(
    dateRange.monthStart
  );
  const [dateToFilter, setDateToFilter] = useState<Date | null>(
    dateRange.monthEnd
  );
  const [paymentMetodeFilter, setPaymentMetodeFilter] = useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const fetchPurchases = async () => {
    setIsLoading(true);
    try {
      const res = await getPurchases(
        currentPage,
        limit,
        debouncedSearch,
        selectedSupplierId,
        paymentMetodeFilter,
        statusFilter,
        dateFromFilter,
        dateToFilter
      );

      setData(res.data);
      setTotalItems(res.meta.total_rows);
    } catch (err) {
      toast.error("Gagal mengambil data purchase");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [
    currentPage,
    limit,
    search,
    selectedSupplierId,
    dateFromFilter,
    dateToFilter,
    statusFilter,
    paymentMetodeFilter,
  ]);

  const TABLE_HEAD = useMemo(
    () => [
      { key: "reference_number", label: "Ref#", sortable: true },
      { key: "date", label: "Tanggal", sortable: true },
      { key: "supplier_name", label: "Supplier", sortable: true },
      {
        key: "sub_total",
        label: "Subtotal",
        sortable: false,
        type: "currency",
      },
      { key: "discount", label: "Diskon", sortable: false, type: "currency" },
      { key: "tax", label: "Pajak", sortable: false, type: "currency" },
      {
        key: "total",
        label: "Total",
        sortable: false,
        type: "currency",
        fontWeight: "bold",
      },
      { key: "description", label: "Deskripsi", sortable: false },
      { key: "payment_type", label: "Tipe Bayar", sortable: false },
    ],
    []
  );

  const TABLE_ROWS = useMemo(() => {
    return data.map((item: any) => ({
      ...item,
      supplier_name: item.supplier?.name || "-",
    }));
  }, [data]);

  //   SAVE PURCHASES

  const handleDownloadPDF = () => {
    generatePurchasePDF(purchaseDetail);
  };

  const handleDownloadExcel = () => {
    generatePurchaseExcel(purchaseDetail);
  };

  const handleDownloadListPDF = () => {
    generatePurchaseListPDF(TABLE_ROWS);
  };

  const handleDownloadListExcel = () => {
    generatePurchaseListExcel(TABLE_ROWS);
  };

  const FILTER = (
    <div className="flex gap-4 mb-4 items-end flex-wrap">
      <GenosTextfield
        id="search"
        label="Cari ref#"
        placeholder="PRC/175....."
        className="w-40 text-xs"
        is_icon_left
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <GenosSearchSelectSupplier
        value={selectedSupplierId}
        onChange={(val: any) => setSelectedSupplierId(val)}
        placeholder="Pilih supplier"
        className="w-40"
        label="Supplier"
      />
      <GenosSelect
        label="Tipe Pembayaran"
        options={[
          { label: "PILIH SEMUA", value: "" },
          { label: "TUNAI", value: "cash" },
          { label: "TEMPO", value: "installment" },
        ]}
        value={paymentMetodeFilter}
        onChange={(e) => {
          console.log("Event:", e);
          console.log("Value:", e.target.value);
          setPaymentMetodeFilter(e.target.value);
        }}
      />

      <GenosSelect
        label="Status Pembayaran"
        options={[
          { label: "PILIH SEMUA", value: "" },
          { label: "Belum Dibayar", value: "unpaid" },
          { label: "Dibayar Sebagian", value: "partial" },
          { label: "Lunas", value: "paid" },
        ]}
        value={statusFilter}
        onChange={(e) => {
          console.log("Event:", e);
          console.log("Value:", e.target.value);
          setStatusFilter(e.target.value);
        }}
        className="w-40"
      />

      <GenosDatepicker
        id="tanggal-dari"
        label="Dari Tanggal"
        className="w-40"
        selected={dateFromFilter}
        onChange={(date) => setDateFromFilter(date)}
      />

      <GenosDatepicker
        id="tanggal-sampai"
        label="Sampai Tanggal"
        className="w-40"
        selected={dateToFilter}
        onChange={(date) => setDateToFilter(date)}
      />
    </div>
  );

  // LIHAT DETAIL
  const handleView = async (id: any) => {
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
          RIGHT_DIV={
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
                  onClick: handleDownloadListPDF,
                },
                {
                  label: "Download Excel",
                  icon: (
                    <i className="fa-regular fa-file-excel text-green-500" />
                  ),
                  onClick: handleDownloadListExcel,
                },
              ]}
            />
          }
          ACTION_BUTTON={{
            view: (row) => {
              handleView(row.id);
              setPurchaseId(row.id);
            },
          }}
        />
      </div>

      {/* MODAL PILIH SUPPLIER */}

      {/* MODAL DETAIL / VIEW */}
      {isModalViewOpen && (
        <PurchaseDetailModal
          show
          onClose={() => setModalViewOpen(false)}
          purchaseDetail={purchaseDetail}
          handleDownloadPDF={handleDownloadPDF}
          handleDownloadExcel={handleDownloadExcel}
          purchaseId={purchaseId}
          handleView={() => handleView(purchaseId)}
          isPayFromDetaildModalOpen={isPayFromDetaildModalOpen}
          setPayFromDetaildModalOpen={setPayFromDetaildModalOpen}
          payAmount={payAmount}
          setPayAmount={setPayAmount}
        />
      )}
    </div>
  );
};

export default PurchaseTableReport;
