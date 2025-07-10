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

const PurchaseTableReport = () => {
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
  const [param, setparam] = useState<string>("");
  const [isFromTambah, setIsFromTambah] = useState(false);

  const [purchaseId, setPurchaseId] = useState<string | null>(null);

  const fetchPurchases = async () => {
    setIsLoading(true);
    try {
      const res = await getPurchases(
        currentPage,
        limit,
        param,
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
    fetchPurchases();
  }, [currentPage, limit, param, selectedSupplier]);

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
    <div className="flex gap-4 mb-4 items-end">
      <GenosTextfield
        id="search"
        label="Cari"
        placeholder="Cari berdasarkan ref# atau deskripsi"
        className="w-full"
        is_icon_left
        value={param}
        onChange={(e) => setparam(e.target.value)}
      />
    </div>
  );

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
