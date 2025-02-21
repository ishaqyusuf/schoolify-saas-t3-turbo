import { prisma } from "@acme/db";

import { ResultEntrySideBarClient } from "./result-entry-sb-client";

export async function ResultEntrySideBar({ searchParams }) {
  const classList = (
    await prisma.exampleClassRoom.findMany({
      select: {
        classCode: true,
        classTitle: true,
      },
    })
  ).map(({ classCode: value, classTitle: label }) => ({
    value,
    label,
  }));
  const classCodes = searchParams?.classCodes?.split(",")?.filter(Boolean);
  const subjectList = (
    await prisma.exampleSubject.findMany({
      where: {
        classSubjects: classCodes?.length
          ? {
              some: {
                classRooms: {
                  some: {
                    classRoom: {
                      classCode: {
                        in: classCodes,
                      },
                    },
                  },
                },
              },
            }
          : undefined,
      },
      select: {
        code: true,
        title: true,
      },
    })
  ).map(({ code: value, title: label }) => ({
    value,
    label,
  }));

  return (
    <ResultEntrySideBarClient
      data={{
        classList,
        subjectList,
      }}
    ></ResultEntrySideBarClient>
  );
}
