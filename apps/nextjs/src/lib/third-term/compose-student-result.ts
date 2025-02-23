import { ResultEntries } from "actions/load-result-entries";

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
  let resultTable = data.assessmentGroup.map((grp) => {
    return grp.subjects.map((subject) => {
      let assessments = subject.assessments.map((a) => {
        const result = student.assessmentResults.find(
          (ar) => ar.classSubjectAssessmentId == a.id,
        );
        let obtainedEn = result?.obtained;
        if (a.obtainable) {
          totalScores.subjects++;
          if (obtainedEn) totalScores.attended++;
          totalScores.obtainable += a.obtainable;
          totalScores.obtained += obtainedEn || 0;
        }
        return {
          ...a,
          score: obtainedEn,
        };
      });
      // .filter((r) => r.obtainable);
      return {
        ...subject,
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
export function composeClassResult(data: ResultEntries[number]) {
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

  return {
    ...data,
    students: students.filter((s) => s.result.percentageAttendance > 59),
    //   .sort(
    //     (a, b) => a.result.totalScores.position - b.result.totalScores.position,
    //   ),
  };
}
