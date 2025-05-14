import { useState } from "react";

export function ToastNotification({ message }: { message: string }) {
  const [show, setShow] = useState(true);

  setTimeout(() => setShow(false), 3000); // Hilang setelah 3 detik

  if (!show) return null;

  return <div></div>;
}
