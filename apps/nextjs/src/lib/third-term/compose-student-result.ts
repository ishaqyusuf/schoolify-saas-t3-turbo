import { ResultEntries } from "actions/load-result-entries";

import { randomNumber2 } from "@acme/utils";

import { configs } from "~/app/exam-result/data";
import { getResultComment } from "./get-result-comment";

export function composeStudentResult({
  data,
  student,
}: {
  data: ResultEntries[number];
  student: ResultEntries[number]["students"][number];
}) {
  let totalScores = {
    obtainable: 0,
    obtained: 0,
    subjects: 0,
    attended: 0,
    position: 0,
  };
  let index = 0;
  let resultTable = data.assessmentGroup.map((grp) => {
    return grp.subjects.map((subject) => {
      let totalScore = 0;
      let assessments = subject.assessments.map((a) => {
        const result = student.assessmentResults.find(
          (ar) => ar.classSubjectAssessmentId == a.id,
        );
        let obtainedEn = result?.obtained;
        if (!obtainedEn && a.obtainable)
          obtainedEn = +(randomNumber2(0, a.obtainable) as any);
        if (a.obtainable) {
          totalScores.subjects++;
          if (obtainedEn) totalScores.attended++;
          totalScores.obtainable += a.obtainable;
          totalScores.obtained += obtainedEn || 0;
          totalScore += obtainedEn || 0;
        }
        return {
          ...a,
          score: obtainedEn,
        };
      });
      assessments.push({
        obtainable: 100,
        score: totalScore,
        title: configs.total,
      } as any);
      // .filter((r) => r.obtainable);
      return {
        ...subject,
        index: (index += 1),
        assessments,
      };
    });
  });
  const percentageAttendance =
    (totalScores.attended / totalScores.subjects) * 100;
  const percentageScore = Math.round(
    (totalScores.obtained / totalScores.obtainable) * 100,
  );
  return {
    resultTable,
    totalScores,
    percentageAttendance,
    percentageScore,
    comment: getResultComment(percentageScore),
  };
}
export function composeClassResult(data: ResultEntries[number], fullPage) {
  let students = data.students.map((student) => {
    return {
      ...student,
      result: composeStudentResult({ data, student }),
    };
  });
  //   students = students.map((student) => {
  //     let position =
  //       students.filter(
  //         (s) =>
  //           student.result.totalScores.obtained > s.result.totalScores.obtained,
  //       ).length + 1;
  //     student.result.totalScores.position = position;
  //     return student;
  //   });
  students = students
    .sort(
      (a, b) => b.result.totalScores.obtained - a.result.totalScores.obtained,
    ) // Sort by highest score
    .map((student, index, sortedArray) => {
      student.result.totalScores.position =
        index > 0 &&
        student.result.totalScores.obtained ===
          sortedArray[index - 1].result.totalScores.obtained
          ? sortedArray[index - 1].result.totalScores.position // Same rank for equal scores
          : index + 1; // Position skips based on index

      return student;
    });

  const resp = {
    ...data,
    students: students.filter((s) => s.result.percentageAttendance > 59),
    pagedStudent: [] as {
      students: {
        data: (typeof students)[number];
        studentIndex: number;
      }[];
    }[],
  };
  resp.students.forEach((student, index) => {
    if (fullPage) {
      resp.pagedStudent.push({
        students: [{ data: student, studentIndex: index }],
      });
    } else {
      const topPage = index % 2 === 0;
      const pageIndex = Math.floor(index / 2);

      if (!resp.pagedStudent[pageIndex]) {
        resp.pagedStudent[pageIndex] = { students: [] };
      }

      resp.pagedStudent[pageIndex].students.push({
        data: student,
        studentIndex: index,
      });
    }
  });

  return resp;
}
