import ThirdTermHeader from "~/components/third-term-header";

export default async function Layout({ children }) {
  return (
    <div>
      <ThirdTermHeader />
      {children}
    </div>
  );
}
