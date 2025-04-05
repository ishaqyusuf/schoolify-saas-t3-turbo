import { ResultEntries } from "actions/example/load-result-entries";

export function groupClassAssessment<T>(subjects: T[]) {
  const groupedAssessments: {
    assessmentNames: { title; obtainable }[];
    subjects: T[];
  }[] = [];
  subjects.map((subject) => {
    const matchedSubjectIndex = groupedAssessments.findIndex((a) =>
      (subject as any).assessments.every((aa) =>
        a.assessmentNames.some((_a) => aa.title?.localeCompare(_a.title) === 0),
      ),
    );
    if (matchedSubjectIndex > -1)
      groupedAssessments[matchedSubjectIndex].subjects.push(subject);
    else {
      groupedAssessments.push({
        assessmentNames: (subject as any).assessments.map((a) => ({
          obtainable: a.obtainable,
          title: a.title,
        })),
        subjects: [subject],
      });
    }
  });
  return groupedAssessments;
}
