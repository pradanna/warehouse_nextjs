import { useState } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
export default function ProfileDropdown() {
  const [user, setUser] = useState({
    username: "john_doe",
    email: "johndoe@example.com",
  });

  const handleLogout = () => {
    console.log("User logged out");
    // Tambahkan logika logout seperti menghapus token atau mengarahkan ke halaman login
  };

  return <div></div>;
}
