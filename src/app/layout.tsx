import { ToastContainer } from "react-toastify";
import { Baloo_Thambi_2 } from "next/font/google";

export const metadata = {
  title: "Warehouse Jodi",
  description: "Website Jodi Warehouse",
};

const baloo = Baloo_Thambi_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-baloo",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={baloo.className}>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
