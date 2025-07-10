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

const SaleTableReport = () => {
  const [data, setData] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [cartItems, setCartItems] = useState<any>([]);

  // State tambahan untuk modal simpan sale
  const [outletId, setOutletId] = useState<string | null | number>(null);

  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);

  const subTotal = cartItems.reduce(
    (acc: number, item: any) => acc + item.total,
    0
  );
  const discountAmount = (subTotal * discountPercent) / 100;
  const taxAmount = (subTotal * taxPercent) / 100;
  const totalAmount = subTotal - discountAmount + taxAmount;

  const [param, setparam] = useState<string>("");

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
    fetchSales();
  }, [currentPage, limit, search, selectedOutlet]);

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

  const TABLE_ROWS = useMemo(() => {
    return data.map((item: any) => ({
      ...item,
      outlet_name: item.outlet?.name || "-",
    }));
  }, [data]);

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

  const FILTER = (
    <div className="flex gap-4 mb-4 items-end">
      <GenosTextfield
        id="search"
        label="Cari"
        placeholder="Cari berdasarkan ref# atau deskripsi"
        className="w-full"
        is_icon_left
        value={param}
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

  // AMBIL DATA SUPPLIER

  const handleDownloadPDF = () => {
    generateSalePDF(saleDetail);
  };

  const handleDownloadExcel = () => {
    generateSaleExcel(saleDetail);
  };

  const handleDownloadListPDF = () => {
    generateSalesListPDF(TABLE_ROWS);
  };

  const handleDownloadListExcel = () => {
    generateSalesListExcel(TABLE_ROWS);
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
