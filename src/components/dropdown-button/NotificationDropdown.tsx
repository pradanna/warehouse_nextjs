import { Fragment, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";

export default function NotificationDropdown() {
  const [notifications] = useState([
    { id: 1, sender: "Anonymus", message: "Pesanan baru telah masuk." },
    { id: 2, sender: "Anonymus", message: "Stok barang hampir habis." },
    { id: 3, sender: "Anonymus", message: "Pengiriman berhasil dilakukan." },
  ]);

  return <div></div>;
}
