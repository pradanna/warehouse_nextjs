import { useEffect, useMemo, useState } from "react";
import GenosTable from "../GenosTable";
import { getDebt, getDebtById } from "@/lib/api/hutangApi";
import { toast } from "react-toastify";
import { getPurchasesById } from "@/lib/api/purchaseApi";
import { generatePurchasePDF } from "@/components/PDF/printPurchasePDF";
import { generatePurchaseExcel } from "@/components/excel/printPurchaseExcel";
import PurchaseDetailModal from "@/components/form/purchase/purchaseDetail";
import GenosTableFrontend from "../GenosTableFrontend";
import GenosSearchSelectSupplier from "@/components/select-search/SupplierSearch";
import GenosSelect from "@/components/form/GenosSelect";

const HutangTable = () => {
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [debtData, setDebtData] = useState([]);
  const [limit] = useState(10);
  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalSisaHutang, setTotalSisaHutang] = useState(0);

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [debtStatusFilter, setDebtStatusFilter] = useState<string>("unpaid");
  const [modalViewId, setModalViewId] = useState<any>();
  const [isModalViewOpen, setModalViewOpen] = useState(false);
  const [debtDetail, setDebtDetail] = useState<any>();
  const [purchaseDetail, setPurchaseDetail] = useState<any>();
  const [payAmount, setPayAmount] = useState(0);
  const [isPayFromDetaildModalOpen, setPayFromDetaildModalOpen] =
    useState(false);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);

  const TABLE_HEAD = useMemo(
    () => [
      { key: "supplier.name", label: "Supplier", sortable: true, type: "text" },
      {
        key: "purchase.date",
        label: "Tanggal Pembelian",
        sortable: true,
        type: "text",
      },

      {
        key: "amount_due",
        label: "Dari Total",
        sortable: true,
        type: "currency",
      },
      {
        key: "amount_paid",
        label: "Dibayarkan",
        sortable: true,
        type: "currency",
      },
      {
        key: "amount_rest",
        label: "Sisa Hutang",
        sortable: true,
        type: "currency",
        fontWeight: "semibold",
      },
    ],
    []
  );

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

  const FetchDebt = async (
    currentPage: number,
    status?: string,
    supplier_id?: string
  ) => {
    setIsLoadingTable(true);

    try {
      const res = await getDebt(currentPage, limit, supplier_id, status);
      setDebtData(res.data);
      console.log(res.data);
      setTABLE_ROWS(res.data);
      setTotalItems(res.meta.total_rows);

      const totalAmountRest = res.data.reduce(
        (sum: number, item: any) => sum + Number(item.amount_rest || 0),
        0
      );

      setTotalSisaHutang(totalAmountRest);
    } catch (err) {
      console.log(err);
    }

    setIsLoadingTable(false);
  };

  useEffect(() => {
    FetchDebt(1, debtStatusFilter, selectedSupplier);
  }, [debtStatusFilter, selectedSupplier]);

  useEffect(() => {
    if (purchaseDetail) {
      console.log("Purchase detail updated:", purchaseDetail);
    }
  }, [purchaseDetail]);

  const handleView = async (id: any) => {
    setModalViewId(id);
    try {
      const response = await getDebtById(id);
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

  return (
    <>
      <GenosTableFrontend
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={TABLE_ROWS}
        PAGINATION
        rowsPerPage={limit}
        // totalRows={totalItems}
        // currentPage={currentPage}
        // onPageChange={setCurrentPage}
        loading={isLoadingTable}
        SORT
        FILTER={
          <div className="flex gap-4 mb-4">
            <GenosSearchSelectSupplier
              value={selectedSupplier}
              onChange={(val: any) => setSelectedSupplier(val?.id)}
              placeholder="Pilih Supplier"
              className="w-55 text-xs"
              label="Outlet"
            />

            <GenosSelect
              label="Status Piutang"
              className="text-xs w-40"
              options={[
                { label: "BELUM LUNAS", value: "unpaid" },
                { label: "LUNAS", value: "paid" },
                { label: "PILIH SEMUA", value: "" },
              ]}
              value={debtStatusFilter}
              onChange={(e) => {
                console.log("Event:", e);
                console.log("Value:", e.target.value);
                setDebtStatusFilter(e.target.value);
              }}
            />
          </div>
        }
        ACTION_BUTTON={{
          view: (row) => {
            handleView(row.id);
            setPurchaseId(row.id);
          },
        }}
      ></GenosTableFrontend>

      <div className="mt-4 flex justify-end">
        <div className="bg-gray-100 px-4 py-2 rounded shadow text-right">
          <p className="text-sm text-gray-600">Total Sisa Hutang:</p>
          <p className="text-lg font-semibold text-red-600">
            Rp {totalSisaHutang.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {isModalViewOpen && (
        <PurchaseDetailModal
          show
          onClose={() => setModalViewOpen(false)}
          purchaseDetail={purchaseDetail}
          handleDownloadPDF={handleDownloadPDF}
          handleDownloadExcel={handleDownloadExcel}
          gotoDetailPayment={gotoDetailPayment}
          purchaseId={purchaseDetail.data.id}
          handleView={() => handleView(purchaseId)}
          isPayFromDetaildModalOpen={isPayFromDetaildModalOpen}
          setPayFromDetaildModalOpen={setPayFromDetaildModalOpen}
          payAmount={payAmount}
          setPayAmount={setPayAmount}
        />
      )}
    </>
  );
};
export default HutangTable;
