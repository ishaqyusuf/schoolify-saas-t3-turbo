import { prisma } from "@acme/db";

export default async function Page({}) {
  const r = await prisma.subjects.findMany({});

  return (
    <div>
      {r.map((a) => (
        <div>{a.name}</div>
      ))}
    </div>
  );
}
