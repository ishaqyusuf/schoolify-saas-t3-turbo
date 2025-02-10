import Link from "next/link";

import Header from "./_components/header";

export default async function Layout({ children }) {
  return (
    <div>
      <Header />

      {children}
    </div>
  );
}
