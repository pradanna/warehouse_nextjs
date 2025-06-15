import { useEffect, useMemo, useState } from "react";
import GenosTable from "../GenosTable";
import { getDebt, getDebtById } from "@/lib/api/hutangApi";
import { toast } from "react-toastify";
import GenosModal from "@/components/modal/GenosModal";
import { formatTanggalIndo } from "@/lib/helper";
import GenosDropdown from "@/components/button/GenosDropdown";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { getPurchasesById } from "@/lib/api/purchaseApi";
import { generatePurchasePDF } from "@/components/PDF/printPurchasePDF";
import { generatePurchaseExcel } from "@/components/excel/printPurchaseExcel";
import PurchaseDetailModal from "@/components/form/purchase/purchaseDetail";

const HutangTable = () => {
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [debtData, setDebtData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [supplier_id, setSupplier_id] = useState("");
  const [status, setStatus] = useState("");
  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalSisaHutang, setTotalSisaHutang] = useState(0);

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
        key: "amount_due",
        label: "Dari Total",
        sortable: false,
        type: "currency",
      },
      {
        key: "amount_paid",
        label: "Dibayarkan",
        sortable: false,
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

  const FetchDebt = async () => {
    setIsLoadingTable(true);

    try {
      const res = await getDebt(currentPage, limit, supplier_id, status);
      setDebtData(res.data);
      setTABLE_ROWS(res.data);
      setTotalItems(res.total);

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
    FetchDebt();
  }, []);

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
          view: (row) => {
            handleView(row.id), setPurchaseId(row.id);
          },
        }}
      ></GenosTable>

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
