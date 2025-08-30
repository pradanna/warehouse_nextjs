import { useEffect, useMemo, useState } from "react";
import GenosTable from "../GenosTable";
import { toast } from "react-toastify";
import GenosModal from "@/components/modal/GenosModal";
import { addOneDay } from "@/lib/helper";

import { createAdjustment, getAdjustmentIn } from "@/lib/api/adjustmentApi";
import GenosTextfield from "@/components/form/GenosTextfield";
import GenosSearchSelectInventory from "@/components/select-search/InventorySearch";

const AdjustmentTableIn = ({ search, dateFrom, dateTo }) => {
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

    console.log("Search:", search);
    console.log("Date From:", dateFrom);
    console.log("Date To:", dateTo);

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

      setTotalItems(res.meta.total_rows);
    } catch (err) {
      console.log(err);
    }

    setIsLoadingTable(false);
  };

  useEffect(() => {
    FetchAdjustment();
  }, [search, dateFrom, dateTo, currentPage]);

  const handleOpenModalAdd = () => {
    setModalAddOpen(true);
  };

  const handleSaveAdjustmentIn = async () => {
    setIsLoadingButton(true);

    const payload = {
      inventory_id: selectedItemId,
      type: "in",
      quantity: qty,
      description: deskripsi,
      date: new Date().toISOString().slice(0, 10),
    };

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

  const refreshFields = () => {
    setSelectedItemId("");
    setQty(0);
    setDeskripsi("");
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

      {isModalAddOpen && (
        <GenosModal
          show
          title={"Penyesuaian Stok Masuk"}
          onClose={() => setModalAddOpen(false)}
          onSubmit={handleSaveAdjustmentIn}
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
          {/* <GenosSearchSelect
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
          /> */}

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
export default AdjustmentTableIn;
