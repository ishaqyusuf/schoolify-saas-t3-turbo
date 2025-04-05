"use server";

import { prisma } from "@acme/db";

import type { AsyncFnType } from "~/lib/types";
import { configs } from "~/app/exam-result/data";
import { groupClassAssessment } from "~/lib/third-term/group-class-assessment";

export type ResultEntries = AsyncFnType<typeof loadResultEntriesAction>;
export async function loadResultEntriesAction(searchParams) {
  const { classCodes, subjectCodes } = searchParams;

  const list = await prisma.exampleClassRoom.findMany({
    where: {
      classCode: classCodes
        ? {
            in: classCodes?.split(","),
          }
        : undefined,
      //   subjects: subjectCodes? {
      //   }:undefined
    },
    include: {
      subjects: {
        where: subjectCodes
          ? {
              classRoomSubject: {
                subject: {
                  code: {
                    in: subjectCodes?.split(","),
                  },
                },
              },
            }
          : undefined,
        include: {
          classRoomSubject: {
            include: {
              subject: true,
            },
          },
          assessments: {
            include: {
              subjectsOnClassRoom: true,
            },
          },
        },
      },
      students: {
        include: {
          assessmentResults: {
            include: {
              classSubjectAssessment: true,
            },
          },
        },
      },
    },
  });
  return list.map((ls) => {
    return {
      ...ls,
      assessmentGroup: groupClassAssessment(ls.subjects),
      students: ls.students.map((std) => {
        return {
          ...std,
          fullName: [std.firstName, std.fathersName, std.otherName]
            .filter(Boolean)
            .join(" "),
          pritName: getDisplayName(
            std.firstName,
            std.fathersName,
            std.otherName,
          ),
        };
      }),
    };
  });
}
function getDisplayName(firstName, surname, lastName) {
  return [firstName, surname, lastName]?.filter(Boolean).map((name) => {
    return name
      ?.split(" ")
      ?.filter(Boolean)
      .map((s) => s.trim())
      .map((s) => {
        const cal = configs.caligraphs[s] || configs.caligraphs2[s];
        // if (!cal) unformattedNames[s] = s;
        return cal || s;
      })
      .join(" ");
  });
}
