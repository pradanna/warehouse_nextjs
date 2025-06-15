import { useEffect, useMemo, useState } from "react";
import GenosTable from "../GenosTable";
import { toast } from "react-toastify";
import GenosModal from "@/components/modal/GenosModal";
import { formatTanggalIndo } from "@/lib/helper";
import GenosDropdown from "@/components/button/GenosDropdown";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { getSalesById } from "@/lib/api/saleApi";
import { generateSalePDF } from "@/components/PDF/printSalePDF";
import { generateSaleExcel } from "@/components/excel/printSaleExcel";
import { getcredit, getcreditById } from "@/lib/api/piutangApi";
import SaleDetailModal from "@/components/form/sale/saleDetail";

const PiutangTable = () => {
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [CreditData, setCreditData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [outlet_id, setoutlet_id] = useState("");
  const [status, setStatus] = useState("");
  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalSisaPiutang, setTotalSisaPiutang] = useState(0);

  const [modalViewId, setModalViewId] = useState<any>();
  const [isModalViewOpen, setModalViewOpen] = useState(false);
  const [CreditDetail, setCreditDetail] = useState<any>();
  const [saleDetail, setSaleDetail] = useState<any>();
  const [payAmount, setPayAmount] = useState(0);
  const [isPayFromDetaildModalOpen, setPayFromDetaildModalOpen] =
    useState(false);
  const [saleId, setSaleId] = useState<string | null>(null);
  const TABLE_HEAD = useMemo(
    () => [
      { key: "outlet.name", label: "outlet", sortable: true, type: "text" },

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
        label: "Sisa Piutang",
        sortable: true,
        type: "currency",
        fontWeight: "semibold",
      },
    ],
    []
  );

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

  const FetchCredit = async () => {
    setIsLoadingTable(true);

    try {
      const res = await getcredit(currentPage, limit, outlet_id, status);
      setCreditData(res.data);
      setTABLE_ROWS(res.data);
      setTotalItems(res.total);

      const totalAmountRest = res.data.reduce(
        (sum: number, item: any) => sum + Number(item.amount_rest || 0),
        0
      );

      setTotalSisaPiutang(totalAmountRest);
    } catch (err) {
      console.log(err);
    }

    setIsLoadingTable(false);
  };

  useEffect(() => {
    FetchCredit();
  }, []);

  useEffect(() => {
    if (saleDetail) {
      console.log("Sale detail updated:", saleDetail);
    }
  }, [saleDetail]);

  const handleView = async (id: any) => {
    setModalViewId(id);
    try {
      const response = await getcreditById(id);
      if (response === undefined) {
        toast.error("Gagal mengambil data penjualan");
      } else {
        try {
          const responseSale = await getSalesById(response.data.sale.id);
          setModalViewOpen(true);
          setSaleDetail(responseSale);

          console.log(saleDetail);
        } catch (err) {
          console.log(err);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data penjualan");
    }
  };

  const handleDownloadPDF = () => {
    generateSalePDF(saleDetail);
  };

  const handleDownloadExcel = () => {
    generateSaleExcel(saleDetail);
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
            handleView(row.id), setSaleId(row.id);
          },
        }}
      ></GenosTable>

      <div className="mt-4 flex justify-end">
        <div className="bg-gray-100 px-4 py-2 rounded shadow text-right">
          <p className="text-sm text-gray-600">Total Sisa Piutang:</p>
          <p className="text-lg font-semibold text-red-600">
            Rp {totalSisaPiutang.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {isModalViewOpen && (
        <SaleDetailModal
          show
          onClose={() => setModalViewOpen(false)}
          saleDetail={saleDetail}
          handleDownloadPDF={handleDownloadPDF}
          handleDownloadExcel={handleDownloadExcel}
          gotoDetailPayment={gotoDetailPayment}
          saleId={saleDetail.data.id}
          handleView={() => handleView(saleId)}
          isPayFromDetaildModalOpen={isPayFromDetaildModalOpen}
          setPayFromDetaildModalOpen={setPayFromDetaildModalOpen}
          payAmount={payAmount}
          setPayAmount={setPayAmount}
        />
      )}
    </>
  );
};
export default PiutangTable;
