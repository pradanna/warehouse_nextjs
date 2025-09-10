"use client";

import GenosPanel from "@/components/panel/GenosPanel";
import EmployeeTable from "@/components/table/employee/EmployeeTable";
import React from "react";

export default function EmployeePage() {
  return (
    <div>
      <GenosPanel
        title="Data Karyawan"
        subtitle="Daftar data Karyawan"
        className="mt-3"
      >
        <EmployeeTable />
      </GenosPanel>
    </div>
  );
}
