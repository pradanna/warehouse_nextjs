import { useEffect, useState } from "react";
import axios from "axios";
import GenosTable from "./GenosTable";
import GenosPagination from "../pagination/GenosPagination";
import GenosTextfield from "../form/GenosTextfield";
import GenosSelect from "../form/GenosSelect";
import GenosModal from "../modal/GenosModal";

const UserTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // FILTER
  const [genderFilter, setGenderFilter] = useState("all");
  const [searchName, setSearchName] = useState("");
  const [minAge, setMinAge] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    console.log("Form submitted");
    handleClose();
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

    const genderMatch = genderFilter === "all" || user.gender === genderFilter;
    const nameMatch = fullName.includes(searchName.toLowerCase());
    const ageMatch = user.age >= minAge;
    const status = (
      <span
        className={`px-2 py-1 rounded text-white text-sm ${"bg-green-600"}`}
      >
        Oke
      </span>
    );

    return genderMatch && nameMatch && ageMatch && status;
  });

  const TABLE_HEAD = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "gender", label: "Gender", sortable: true },
    { key: "age", label: "Age", sortable: true },
    { key: "height", label: "height", sortable: true },
  ];

  const TABLE_ROWS = filteredUsers.map((user) => ({
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    gender: user.gender,
    age: user.age,
    height: (
      <span
        className={`px-2 py-1 rounded text-white text-sm ${
          user.height <= 180 ? "bg-red-600" : "bg-green-400"
        }`}
      >
        {user.height}
      </span>
    ),
  }));

  // Fungsi untuk mengambil data user
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await axios.get(`https://dummyjson.com/users?limit=96`);
      const allUsers = response.data.users;

      const usersWithName = allUsers.map((user: any) => ({
        ...user,
        name: `${user.firstName} ${user.lastName}`,
      }));

      if (sortKey) {
        allUsers.sort((a: any, b: any) => {
          let aVal: string | number = "";
          let bVal: string | number = "";

          if (sortKey === "name") {
            aVal = `${a.firstName} ${a.lastName}`;
            bVal = `${b.firstName} ${b.lastName}`;
          } else {
            aVal = a[sortKey];
            bVal = b[sortKey];
          }

          // Sorting string
          if (typeof aVal === "string" && typeof bVal === "string") {
            return sortOrder === "asc"
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          }

          // Sorting number
          if (typeof aVal === "number" && typeof bVal === "number") {
            return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
          }

          return 0;
        });
      }

      // Set total users
      setTotalUsers(usersWithName.length);

      // Paginate manually
      // const start = (currentPage - 1) * limit;
      // const paginatedUsers = allUsers.slice(start, start + limit);
      setUsers(usersWithName);
    } catch (err: any) {
      setError(true);
    } finally {
      setLoading(false);
    }

    // Apply sorting (untuk semua field termasuk 'name')
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortKey, sortOrder]);

  // const TABLE_ROWS = users.map((user: any) => ({
  //   name: `${user.firstName} ${user.lastName}`,
  //   email: user.email,
  //   gender: user.gender,
  //   age: user.age,
  // }));

  return (
    <div>
      <GenosTable
        TABLE_HEAD={TABLE_HEAD}
        TABLE_ROWS={TABLE_ROWS}
        SORT
        CHECKBOXS
        PAGINATION
        totalRows={filteredUsers.length}
        currentPage={currentPage}
        onAddData={handleOpen}
        ACTION_BUTTON={{}}
        FILTER={
          <div className="flex gap-4 mb-4">
            <GenosSelect
              label="Gender"
              name="status"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              options={[
                { label: "All Genders", value: "all" },
                { label: "Male", value: "male" },
                { label: "Female", value: "inactive" },
              ]}
            />

            <GenosTextfield
              label="Search by Name"
              className="w-"
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />

            <GenosTextfield
              label="Minimum Age"
              type="number"
              placeholder="Min Age"
              value={minAge.toString()}
              onChange={(e) => setMinAge(Number(e.target.value))}
            />
          </div>
        }
        // onPageChange={(page) => setCurrentPage(page)}
        rowsPerPage={limit}
        // onSortChange={(key, order) => {
        //   setSortKey(key);
        //   setSortOrder(order);
        // }}
        loading={loading}
        error={error}
      />

      {isModalOpen && (
        <GenosModal
          title="Tambah Data"
          onClose={handleClose}
          onSubmit={handleSubmit}
          show
          children={
            <div>
              <p>test</p>
            </div>
          }
        >
          {/* Form atau konten modal */}
        </GenosModal>
      )}
    </div>
  );
};

export default UserTable;
