// components/SaleDetailModal.tsx
"use client";
import React, { useState } from "react";
import { PrinterIcon } from "@heroicons/react/24/outline";
import GenosModal from "@/components/modal/GenosModal";
import GenosDropdown from "@/components/button/GenosDropdown";
import { formatTanggalIndo } from "@/lib/helper";
import GenosButton from "@/components/button/GenosButton";
import PaymentModal from "../debt/debtPayment";
import { toast } from "react-toastify";
import { createSalePayment } from "@/lib/api/saleApi";

const SaleDetailModal = ({
  show,
  onClose,
  saleDetail,
  handleDownloadPDF,
  handleDownloadExcel,
  gotoDetailPayment,
  handleView,
  isPayFromDetaildModalOpen,
  setPayFromDetaildModalOpen,
  payAmount,
  setPayAmount,
  saleId,
}: {
  show: boolean;
  onClose: () => void;
  saleDetail: any;
  handleDownloadPDF: () => void;
  handleDownloadExcel: () => void;
  gotoDetailPayment?: () => void;
  handleView: (saleId: string | null) => Promise<void>;
  isPayFromDetaildModalOpen: boolean;
  setPayFromDetaildModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  payAmount: number;
  setPayAmount: React.Dispatch<React.SetStateAction<number>>;
  saleId: string | null;
}) => {
  const closeDetailPayment = () => {
    setPayFromDetaildModalOpen(false);
  };

  const [paymentMetode, setPaymentMetode] = useState("");
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const handleSavePayDebt = async () => {
    setIsLoadingButton(true);

    const today = new Date().toISOString().slice(0, 10);

    const payload = {
      sale_id: saleId,
      date: today,
      description: "Installments / Pembayaran Tempo",
      payment_type: paymentMetode,
      amount: payAmount,
    };

    try {
      const response = await createSalePayment(payload);
      console.log("Response dari API:", response);

      if (response.success === false) {
        if (response.message) {
          toast.error(response.message);
        } else {
          toast.error("Gagal melakukan pembayaran");
        }
      } else {
        toast.success("Data pembelian berhasil disimpan");

        handleView(saleId);
        setPayFromDetaildModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan data pembelian");
    } finally {
      setIsLoadingButton(false);
    }
  };

  return (
    <div>
      <GenosModal
        show={show}
        title="Detail Penjualan"
        onClose={onClose}
        size="xl2"
        withCloseButton={false}
      >
        {/* Header Info */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="p-4 rounded-md w-full md:w-auto flex-1">
            <p className="text-xs font-light">Nomor Referensi</p>
            <p className="text-lg font-bold">
              {saleDetail.data.reference_number}
            </p>
          </div>
          <div className="flex flex-col justify-end">
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
                  onClick: handleDownloadPDF,
                },
                {
                  label: "Download Excel",
                  icon: (
                    <i className="fa-regular fa-file-excel text-green-500" />
                  ),
                  onClick: handleDownloadExcel,
                },
              ]}
            />
          </div>
        </div>

        {/* Main Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm text-gray-600 mb-5">
          <div className="md:col-span-2 bg-white border border-gray-200 p-4 rounded-md">
            <p className="text-xs font-light">Tanggal Penjualan</p>
            <p className="font-bold">
              {formatTanggalIndo(saleDetail.data.date)}
            </p>
          </div>
          <div className="md:col-span-6 bg-white border border-gray-200 p-4 rounded-md">
            <p className="font-medium text-xs">Deskripsi</p>
            <p className="font-bold">{saleDetail.data.description}</p>
          </div>
          <div className="md:col-span-4 bg-white border border-gray-200 p-4 rounded-md">
            <p className="font-medium text-xs">Outlet</p>
            <p className="font-bold">{saleDetail.data.outlet?.name}</p>
          </div>

          {/* Daftar Item */}
          <div className="md:col-span-8 bg-white border border-gray-200 p-4 rounded-md">
            <h2 className="text-md font-semibold text-gray-700 mb-2">
              Daftar Item
            </h2>
            <hr className="my-4 border-gray-200" />
            <div className="overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-700 font-medium">
                  <tr>
                    <th className="p-2">Nama</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Unit</th>
                    <th className="p-2">Harga</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {saleDetail.data.items.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-2 font-bold text-xs">{item.name}</td>
                      <td className="p-2 text-xs">{item.quantity}</td>
                      <td className="p-2 text-xs">{item.unit}</td>
                      <td className="p-2 text-xs">
                        Rp {item.price.toLocaleString("id-ID")}
                      </td>
                      <td className="p-2 text-xs">
                        Rp {item.total.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pembayaran & Ringkasan */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="bg-white border border-gray-200 p-4 rounded-md">
              <p className="font-medium text-xs">Jenis Pembayaran</p>
              <p className="font-bold">{saleDetail.data.payment_type}</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-md">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Ringkasan
              </p>
              <div className="flex justify-between">
                <span className="text-xs">Sub Total</span>
                <span className="text-xs">
                  Rp {saleDetail.data.sub_total.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Diskon</span>
                <span className="text-xs">
                  Rp {saleDetail.data.discount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Pajak</span>
                <span className="text-xs">
                  Rp {saleDetail.data.tax.toLocaleString("id-ID")}
                </span>
              </div>
              <hr className="my-4 border-gray-200" />
              <div className="flex justify-between font-semibold text-green-700 text-lg">
                <span>Total</span>
                <span>Rp {saleDetail.data.total.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          {/* Riwayat Pembayaran */}
          <div className="md:col-span-12 bg-white border border-gray-200 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <h2 className="text-md font-semibold text-gray-700 mb-2">
                Pembayaran{" "}
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    saleDetail.data.payment_status === "paid"
                      ? "bg-green-100 text-green-700"
                      : saleDetail.data.payment_status === "partial"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {saleDetail.data.payment_status}
                </span>
              </h2>
              {gotoDetailPayment && (
                <GenosButton
                  label="Tambah Pembayaran"
                  color="success"
                  round="sm"
                  onClick={gotoDetailPayment}
                />
              )}
            </div>
            <hr className="my-4 border-gray-200" />
            <table className="w-full text-sm text-left">
              <thead className="text-gray-700 font-medium">
                <tr>
                  <th className="p-2">Tanggal</th>
                  <th className="p-2">Jumlah</th>
                  <th className="p-2">Deskripsi</th>
                  <th className="p-2">Metode Pembayaran</th>
                </tr>
              </thead>
              <tbody>
                {saleDetail.data.payments.map((payment: any, index: number) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-2 text-sm">{payment.date}</td>
                    <td className="p-2 text-sm">
                      Rp {payment.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="p-2 text-sm">{payment.description}</td>
                    <td className="p-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          payment.payment_type === "digital"
                            ? "bg-blue-100 text-blue-700"
                            : payment.payment_type === "cash"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {payment.payment_type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {saleDetail.data.payment_status !== "paid" && (
              <div className="flex justify-end mt-4">
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm font-semibold">
                  Kekurangan Bayar: Rp{" "}
                  {(
                    saleDetail.data.total -
                    saleDetail.data.payments.reduce(
                      (acc: number, cur: any) => acc + cur.amount,
                      0
                    )
                  ).toLocaleString("id-ID")}
                </div>
              </div>
            )}
          </div>
        </div>
      </GenosModal>

      {isPayFromDetaildModalOpen && (
        <PaymentModal
          show
          isLoadingButton={isLoadingButton}
          onClose={closeDetailPayment}
          onSubmit={handleSavePayDebt}
          paymentMethod={paymentMetode}
          setPaymentMethod={setPaymentMetode}
          payAmount={payAmount}
          setPayAmount={setPayAmount}
        />
      )}
    </div>
  );
};

export default SaleDetailModal;
