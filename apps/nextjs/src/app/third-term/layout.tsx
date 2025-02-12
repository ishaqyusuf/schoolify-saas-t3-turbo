import { Suspense } from "react";

import ThirdTermHeader from "~/components/third-term-header";

export default async function Layout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThirdTermHeader />
      {children}
    </Suspense>
  );
}
