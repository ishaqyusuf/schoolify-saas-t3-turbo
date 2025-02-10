import { redirect } from "next/navigation";

import { HydrateClient } from "~/trpc/server";
import Dashboard from "./_components/dashboard";

export const runtime = "edge";

export default async function HomePage({ params }) {
  redirect("/third-term");
  // const schools = await db.query.School.findMany();

  // You can await this here if you don't want to show Suspense fallback below
  // void api.post.all.prefetch();

  return (
    <HydrateClient>
      <Dashboard />
    </HydrateClient>
  );
}
