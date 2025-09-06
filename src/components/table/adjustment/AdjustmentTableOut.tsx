import { useEffect, useMemo, useState } from "react";
import GenosTable from "../GenosTable";
import { toast } from "react-toastify";
import GenosModal from "@/components/modal/GenosModal";
import { addOneDay } from "@/lib/helper";

import { createAdjustment, getAdjustmentOut } from "@/lib/api/adjustmentApi";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosSearchSelect from "@/components/form/GenosSearchSelect";
import { getInventory } from "@/lib/api/inventory/inventoryApi";
import GenosSearchSelectInventory from "@/components/select-search/InventorySearch";
import dayjs from "dayjs";

type Props = {
  search: string;
  dateFrom: Date | null;
  dateTo: Date | null;
};

const AdjustmentTableOut = ({ search, dateFrom, dateTo }: Props) => {
  interface Adjustment {
    id: string;
    name: string;
    unit: string;
    description: string;
    quantity: number;
  }

  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [adjustmentData, setAdjustmentData] = useState<Adjustment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [qty, setQty] = useState<string | number>(0);
  const [deskripsi, setDeskripsi] = useState<string>("");

  const [AdjustmentOutDetail, setAdjustmentOutDetail] = useState<any>();
  const [isModalAddOpen, setModalAddOpen] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState<string>("");

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
      const res = await getAdjustmentOut(
        currentPage,
        limit,
        search,
        dateFrom,
        addOneDay(dateTo)
      );
      setAdjustmentData(res.data);
      setTABLE_ROWS(res.data);
      setTotalItems(res.meta.total_rows);
    } catch (err) {
      console.log(err);
    }

    setIsLoadingTable(false);
  };

  useEffect(() => {
    FetchAdjustment();
  }, [search, dateFrom, dateTo, currentPage]);

  useEffect(() => {
    if (AdjustmentOutDetail) {
      console.log("AdjustmentOut detail updated:", AdjustmentOutDetail);
    }
  }, [AdjustmentOutDetail]);

  const handleOpenModalAdd = () => {
    setModalAddOpen(true);
  };

  const refreshFields = () => {
    setSelectedItemId("");
    setQty(0);
    setDeskripsi("");
  };

  const handleSaveAdjustmentOut = async () => {
    setIsLoadingButton(true);

    const payload = {
      inventory_id: selectedItemId,
      type: "out",
      quantity: qty,
      description: deskripsi,
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
        setModalAddOpen(false);
        FetchAdjustment();
        refreshFields();
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
    } finally {
      setIsLoadingButton(false);
    }
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
        onAddData={handleOpenModalAdd}
        fontSize="xs"
        FILTER
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
      ></GenosTable>

      {isModalAddOpen && (
        <GenosModal
          show
          title={"Penyesuaian Stok Keluar"}
          onClose={() => setModalAddOpen(false)}
          onSubmit={handleSaveAdjustmentOut}
          isLoading={isLoadingButton}
        >
          <GenosSearchSelectInventory
            label="Item"
            placeholder="Pilih item"
            className={"mb-5"}
            value={selectedItemId}
            onChange={(itemId) => {
              setSelectedItemId(itemId as string);
            }}
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
    </>
  );
};
export default AdjustmentTableOut;
