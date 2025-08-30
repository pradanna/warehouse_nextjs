"use client";
import GenosModal from "@/components/modal/GenosModal";
import React from "react";
import GenosSelect from "../GenosSelect";
import GenosTextfield from "../GenosTextfield";

type PaymentModalProps = {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  payAmount: number;
  setPayAmount: (value: number) => void;
  isLoadingButton: boolean;
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  show,
  onClose,
  onSubmit,
  paymentMethod,
  setPaymentMethod,
  payAmount,
  setPayAmount,
  isLoadingButton,
}) => {
  return (
    <GenosModal
      show={show}
      title="Pembayaran"
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoadingButton}
    >
      <GenosSelect
        label="Metode Pembayaran"
        options={[
          { label: "Cash", value: "cash" },
          { label: "Digital", value: "digital" },
        ]}
        value={paymentMethod}
        onChange={(e: any) => {
          setPaymentMethod(e.target.value);
        }}
        className="mb-5"
      />

      <GenosTextfield
        id="tambah-purchase-dp"
        label="Jumlah Pembayaran"
        type="number"
        value={payAmount}
        onChange={(e: any) => setPayAmount(Number(e.target.value))}
      />
    </GenosModal>
  );
};

export default PaymentModal;
