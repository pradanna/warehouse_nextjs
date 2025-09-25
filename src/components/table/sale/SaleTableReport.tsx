import { useEffect, useMemo, useState } from "react";
import GenosTable from "@/components/table/GenosTable";
import GenosTextfield from "@/components/form/GenosTextfield";
import { toast } from "react-toastify";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { getSales, getSalesById } from "@/lib/api/saleApi";
import GenosDropdown from "@/components/button/GenosDropdown";
import { generateSalePDF } from "@/components/PDF/printSalePDF";
import { generateSaleExcel } from "@/components/excel/printSaleExcel";
import SaleDetailModal from "@/components/form/sale/saleDetail";
import { generateSalesListPDF } from "@/components/PDF/printSalesListPDF";
import { generateSalesListExcel } from "@/components/excel/printSalesListExcel";
import { dateRange } from "@/lib/helper";
import { useDebounce } from "@/lib/utils/useDebounce";
import GenosDatepicker from "@/components/form/GenosDatepicker";
import GenosSelect from "@/components/form/GenosSelect";
import GenosSearchSelectOutlet from "@/components/select-search/GenosSearchOutlet";
import GenosTableFrontend from "../GenosTableFrontend";

const SaleTableReport = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
  const [selectedOutletName, setSelectedOutletName] = useState<string | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [cartItems, setCartItems] = useState<any>([]);

  // State tambahan untuk modal simpan sale

  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);

  const subTotal = cartItems.reduce(
    (acc: number, item: any) => acc + item.total,
    0
  );

  const [saleDetail, setSaleDetail] = useState<any>();
  const [isModalViewOpen, setModalViewOpen] = useState(false);

  const [isPayFromDetaildModalOpen, setPayFromDetaildModalOpen] =
    useState(false);

  const [saleId, setSaleId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState(0);

  // FILTER
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState<Date | null>(
    dateRange.monthStart
  );
  const [dateToFilter, setDateToFilter] = useState<Date | null>(
    dateRange.monthEnd
  );
  const [paymentMetodeFilter, setPaymentMetodeFilter] = useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const res = await getSales(
        currentPage,
        100000000000,
        debouncedSearch,
        selectedOutletId,
        paymentMetodeFilter,
        statusFilter,
        dateFromFilter,
        dateToFilter
      );

      setData(res.data);
      setTotalItems(res.meta.total_rows);
    } catch (err) {
      toast.error("Gagal mengambil data sale");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [
    currentPage,
    limit,
    debouncedSearch,
    selectedOutletId,
    paymentMetodeFilter,
    statusFilter,
    dateFromFilter,
    dateToFilter,
  ]);

  const TABLE_HEAD = useMemo(
    () => [
      { key: "reference_number", label: "Ref#", sortable: true },
      { key: "date", label: "Tanggal", sortable: true },
      { key: "outlet_name", label: "Outlet", sortable: true },
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
        sortable: true,
        type: "currency",
        fontweight: "bold",
      },
      { key: "description", label: "Deskripsi", sortable: false },
      { key: "payment_type", label: "Tipe Bayar", sortable: false },
    ],
    []
  );

  const TABLE_ROWS = useMemo(() => {
    return data.map((item: any) => ({
      ...item,
      outlet_name: item.outlet?.name || "-",
    }));
  }, [data]);

  // LIHAT DETAIL
  const handleView = async (id: any) => {
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
      <GenosSearchSelectOutlet
        value={selectedOutletId}
        onChange={(val) => {
          // val adalah OutletOption | null
          setSelectedOutletId(val?.id ?? null); // simpan ID (string|null)
          setSelectedOutletName(val?.name ?? null); // simpan nama (string|null)
        }}
        placeholder="Pilih outlet"
        className="w-40"
        label="Outlet"
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

  // AMBIL DATA SUPPLIER

  const handleDownloadPDF = () => {
    generateSalePDF(saleDetail);
  };

  const handleDownloadExcel = () => {
    generateSaleExcel(saleDetail);
  };

  const handleDownloadListPDF = () => {
    generateSalesListPDF(TABLE_ROWS, {
      search: search,
      selectedOutlet: selectedOutletName,
      paymentMetodeFilter: paymentMetodeFilter,
      statusFilter: statusFilter,
      dateFromFilter: dateFromFilter,
      dateToFilter: dateToFilter,
    });
  };

  const handleDownloadListExcel = () => {
    generateSalesListExcel(TABLE_ROWS, {
      search,
      selectedOutlet: selectedOutletName,
      paymentMetodeFilter,
      statusFilter,
      dateFromFilter,
      dateToFilter,
    });
  };

  return (
    <div className="flex gap-4">
      <div className="flex-grow">
        <GenosTableFrontend
          TABLE_HEAD={TABLE_HEAD}
          TABLE_ROWS={TABLE_ROWS}
          PAGINATION
          SORT
          rowsPerPage={limit}
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
              setSaleId(row.id);
              handleView(row.id);
            },
          }}
        />

        {/* MODAL DETAIL / VIEW */}
        {isModalViewOpen && (
          <SaleDetailModal
            show={isModalViewOpen}
            onClose={() => setModalViewOpen(false)}
            saleDetail={saleDetail}
            handleDownloadPDF={handleDownloadPDF}
            handleDownloadExcel={handleDownloadExcel}
            saleId={saleId}
            handleView={() => handleView(saleId)}
            isPayFromDetaildModalOpen={isPayFromDetaildModalOpen}
            setPayFromDetaildModalOpen={setPayFromDetaildModalOpen}
            payAmount={payAmount}
            setPayAmount={setPayAmount}
          />
        )}
      </div>
    </div>
  );
};

export default SaleTableReport;
