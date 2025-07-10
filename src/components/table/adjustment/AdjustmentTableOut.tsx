import { useEffect, useMemo, useState } from "react";
import GenosTable from "../GenosTable";
import { toast } from "react-toastify";
import GenosModal from "@/components/modal/GenosModal";
import { addOneDay } from "@/lib/helper";

import { createAdjustment, getAdjustmentOut } from "@/lib/api/adjustmentApi";
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

const AdjustmentTableOut = ({
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
  const [type, setType] = useState("");
  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [qty, setQty] = useState<string | number>(0);
  const [deskripsi, setDeskripsi] = useState<string>("");
  const [totalSisaAdjustment, setTotalSisaAdjustment] = useState(0);

  const [modalViewId, setModalViewId] = useState<any>();
  const [isModalViewOpen, setModalViewOpen] = useState(false);
  const [debtDetail, setAdjustmentDetail] = useState<any>();
  const [AdjustmentOutDetail, setAdjustmentOutDetail] = useState<any>();
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
      const res = await getAdjustmentOut(
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
    if (AdjustmentOutDetail) {
      console.log("AdjustmentOut detail updated:", AdjustmentOutDetail);
    }
  }, [AdjustmentOutDetail]);

  const handleOpenModalAdd = () => {
    setModalAddOpen(true);
  };

  const handleSaveAdjustmentOut = async () => {
    const payload = {
      inventory_id: selectedInventory.id,
      type: "out",
      quantity: qty,
      deskripsi,
      date: new Date().toISOString().slice(0, 10),
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
