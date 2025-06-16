import { useEffect, useMemo, useState } from "react";
import GenosTable from "../GenosTable";
import { toast } from "react-toastify";
import GenosModal from "@/components/modal/GenosModal";
import { addOneDay, formatTanggalIndo } from "@/lib/helper";
import GenosDropdown from "@/components/button/GenosDropdown";
import { PrinterIcon } from "@heroicons/react/24/outline";

import {
  createAdjustment,
  getAdjustment,
  getAdjustmentById,
  getAdjustmentIn,
  getAdjustmentOut,
} from "@/lib/api/adjustmentApi";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosSearchSelect from "@/components/form/GenosSearchSelect";
import { getInventory } from "@/lib/api/inventoryApi";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  dateFrom: Date | null;
  setDateFrom: (value: Date | null) => void;
  dateTo: Date | null;
  setDateTo: (value: Date | null) => void;
};

const AdjustmentTableInReport = ({
  search,
  setSearch,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: Props) => {
  interface Adjustment {
    id: string;
    name: string;
    unit: string;
    description: string;
    quantity: number;
  }

  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [adjustmentData, setAdjustmentData] = useState<Adjustment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [qty, setQty] = useState<string | number>(0);
  const [deskripsi, setDeskripsi] = useState<string>("");

  const [AdjustmentInDetail, setAdjustmentInDetail] = useState<any>();
  const [isModalAddOpen, setModalAddOpen] = useState(false);

  const [inventories, setInventories] = useState<any>();
  const [selectedItem, setSelectedItem] = useState<any>();
  const [selectedInventory, setSelectedInventory] = useState<any>();
  const [param, setparam] = useState<string>("");
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
        key: "quantity",
        label: "Qty",
        sortable: false,
        type: "nuumber",
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
      const res = await getAdjustmentIn(
        currentPage,
        limit,
        search,
        dateFrom,
        addOneDay(dateTo)
      );
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
  }, [search, dateFrom, dateTo, currentPage]);

  useEffect(() => {
    if (AdjustmentInDetail) {
      console.log("AdjustmentIn detail updated:", AdjustmentInDetail);
    }
  }, [AdjustmentInDetail]);

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
        fontSize="xs"
        ACTION_BUTTON={{
          collapse: (row) => (
            <div className="grid grid-cols-2 gap-2">
              <div className="text-xs">
                <strong>Deskripsi:</strong>{" "}
                {(adjustmentData.find((r: any) => r.id === row.id)
                  ?.description as string) || ""}
              </div>
            </div>
          ),
        }}
        FILTER
      ></GenosTable>
    </>
  );
};
export default AdjustmentTableInReport;
