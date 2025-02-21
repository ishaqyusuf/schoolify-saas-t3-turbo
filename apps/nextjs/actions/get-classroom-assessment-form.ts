"use server";

import { prisma } from "@acme/db";

import { actionClient } from "./safe-action";
import { getClassRoomAssessmentFormSchema } from "./schema";

export const getClassRoomAssessmentForm = actionClient
  .schema(getClassRoomAssessmentFormSchema)
  .action(async ({ parsedInput: data }) => {
    console.log({ data });

    const _data = await prisma.exampleClassRoom.findFirst({
      where: {
        id: data.classRoomId,
      },
      include: {
        students: {
          select: {
            id: true,
            firstName: true,
            otherName: true,
            fathersName: true,
          },
        },
        subjects: {
          include: {
            classRoomSubject: {
              select: {
                subject: {
                  select: {
                    code: true,
                    title: true,
                  },
                },
              },
            },
            assessments: {
              include: {},
            },
          },
        },
      },
    });
    const groupedAssessments: {
      assessmentNames: { title; obtainable }[];
      subjects: (typeof _data)["subjects"];
    }[] = [];
    _data.subjects.map((subject) => {
      let matchedSubjectIndex = groupedAssessments.findIndex((a) =>
        subject.assessments.every((aa) =>
          a.assessmentNames.some(
            (_a) =>
              aa.title?.localeCompare(_a.title) &&
              _a.obtainable === aa.obtainable,
          ),
        ),
      );
      if (matchedSubjectIndex > -1)
        groupedAssessments[matchedSubjectIndex].subjects.push(subject);
      else {
        groupedAssessments.push({
          assessmentNames: subject.assessments.map((a) => ({
            obtainable: a.obtainable,
            title: a.title,
          })),
          subjects: [subject],
        });
      }
    });
    const classList = await prisma.exampleClassRoom.findMany({
      where: {},
      select: {
        classCode: true,
        id: true,
        classTitle: true,
      },
    });
    console.log({ groupedAssessments });

    return {
      classRoom: _data,
      classList,
      groupedAssessments,
    };
  });
