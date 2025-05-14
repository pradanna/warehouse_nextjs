import { useState } from "react";

import { useMessage } from "@/components/etc/MessageContext";

const CategoriesPage = () => {
  // State untuk input kategori (Tambah)
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });

  // State untuk data yang sedang diedit
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    description: "",
  });

  const { inputMessage, setInputMessage } = useMessage();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });

    setInputMessage("");
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });

    setInputMessage("");
  };

  const columns = [
    { label: "Nama Kategori", field: "name", fieldClassname: "font-bold" },
    { label: "Deskripsi", field: "description", fieldClassname: "text-red" },
  ];

  return <div></div>;
};

export default CategoriesPage;
