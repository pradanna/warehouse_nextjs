function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path
        fillRule="evenodd"
        d="M6.225 4.811a.75.75 0 011.06 0L12 9.526l4.715-4.715a.75.75 0 111.06 1.06L13.06 10.5l4.715 4.715a.75.75 0 11-1.06 1.06L12 11.56l-4.715 4.715a.75.75 0 11-1.06-1.06L10.94 10.5 6.225 5.785a.75.75 0 010-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function GenosDataTableError({ message = "Terjadi Kesalahan" }) {
  return <div></div>;
}
