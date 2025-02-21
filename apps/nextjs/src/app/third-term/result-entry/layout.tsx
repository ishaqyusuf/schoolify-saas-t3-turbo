import { ResultEntrySideBar } from "~/components/result-entry-side-bar";

export default async function Layout({ children, searchParams }) {
  // const {classCodes,subjectCodes} =

  return (
    <>
      <ResultEntrySideBar searchParams={searchParams} />
      {children}
    </>
  );
}
