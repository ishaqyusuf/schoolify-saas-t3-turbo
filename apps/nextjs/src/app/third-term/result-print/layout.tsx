import { ResultPrintSideBar } from "~/components/result-print-side-bar";

export default async function Layout({ children, searchParams }) {
  // const {classCodes,subjectCodes} =

  return (
    <>
      <ResultPrintSideBar />
      {children}
    </>
  );
}
