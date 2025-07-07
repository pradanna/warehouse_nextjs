// components/wrapper/ItemClientWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import GenosPanel from "@/components/panel/GenosPanel";

const ItemTable = dynamic(() => import("@/components/table/item/ItemTable"), {
  ssr: false,
});

export default function ItemClientWrapper() {
  return (
    <GenosPanel title="Data Item" subtitle="Daftar data Item" className="mt-3">
      <ItemTable />
    </GenosPanel>
  );
}
