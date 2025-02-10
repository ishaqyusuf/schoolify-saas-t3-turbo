import type { StoreType } from "./store";
import { configs } from "~/app/exam-result/data";
import { rawResultData } from "./raw";

const cellSepartors = [". ", "؛ "];
export type ClassData = ReturnType<typeof newClassData>;
export function newClassData() {
  return {
    class: "",
    subjects: [] as {
      id: number;
      title: string;
      scheme: { title: string; obtainable?: number }[];
    }[],
    totalStudents: null as any,
    students: [] as {
      firstName: string;
      fullName: string;
      surname: string;
      otherName: string;
      displayName: string[];
      printable: boolean;
      scores: {
        title;
        scheme: { score: number; title: string; scoreAr: string }[];
        total?: number;
        totalAr: string;
        subjectId?: number;
      }[];
      totalScore?;
      totalScoreAr?;
      position?;
      positionAr?;
    }[],
  };
}
const unformattedNames = {};
function getDisplayName(firstName, surname, lastName) {
  return [firstName, surname, lastName]?.filter(Boolean).map((name) => {
    return name
      ?.split(" ")
      ?.filter(Boolean)
      .map((s) => s.trim())
      .map((s) => {
        const cal = configs.caligraphs[s] || configs.caligraphs2[s];
        if (!cal) unformattedNames[s] = s;
        return cal || s;
      })
      .join(" ");
  });
}
export function compose(store: StoreType) {
  let classData = newClassData();

  rawResultData
    .split("\n")
    .map((l) => l?.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [title, className] = line?.split(": ");
      if (className) {
        // console.log({ ...classData });
        if (classData.class) store.insertClassData(classResult(classData));
        classData = newClassData();
        classData.class = className;
        return;
      }
      let splitted;
      cellSepartors?.map((c) => {
        splitted = splitted
          ? splitted?.map((s) => s?.split(c)?.flat()).flat()
          : line?.split(c);
      });

      if (classData.class && !classData?.subjects?.length) {
        const [name, ...subjects] = splitted;
        classData.subjects = subjects?.map((s, index) => {
          //   console.log(s);
          const [mainTitle, schemes] = s?.split(":");
          if (schemes) {
            // "الحفظ،القراءة،المراجعة،الصوت"
            const schemls = schemes?.split("،");
            return {
              title: mainTitle,
              id: index + 1,
              scheme: schemls.map((s) => {
                return {
                  title: s,
                };
              }),
            };
          }
          return {
            title: s,
            id: index + 1,
          };
        });

        // console.log(classData.subjects);
      } else {
        const [name, ...scores] = splitted;
        const dotName = name?.includes(".");
        const [firstName, surname, otherName] = dotName
          ? name?.split(".")
          : name.split(" ");
        if (!dotName && otherName) {
          console.error(`${name} ${classData.class}`);
        }
        const fullName = [firstName, surname, otherName]
          ?.filter(Boolean)
          .join(" ");
        const scoress = classData.subjects.map((s, i) => {
          const schemaScores = scores[i]?.trim()?.split("،");
          if (schemaScores?.length > 1)
            console.log({ schemaScores, fullName, scores: scores[i] });

          const total = schemaScores
            ?.map((sl) => {
              if (sl) return arToEn(sl?.split(".")?.filter(Boolean).join(""));
              return null;
            })
            // .filter(Boolean)
            ?.map((a) => (a ? Number(a) : 0))
            .reduce((a, b) => a + b, 0);
          const totalAr = total ? enToAr(total) : ""; //scores[i]?.trim();
          // const total = totalAr ? arToEn(totalAr) : null;
          // if (!s.scheme)
          let scheme = s.scheme
            ?.map((sch, i) => {
              const scoreAr = schemaScores[i]?.trim();
              const score = scoreAr ? arToEn(scoreAr) : null;
              return {
                title: sch.title,
                score,
                scoreAr,
              };
            })
            .filter((s) => s.score); // Filter items with a score

          // Ensure at least 3 items are returned
          if (scheme?.length < 3 && s.scheme?.length > 1) {
            scheme = s.scheme.slice(0, 3).map((sch, i) => ({
              title: sch.title,
              score: enToAr(0), // Default score if missing
              scoreAr: enToAr(0),
            }));
          }
          // const scheme = s.scheme
          //   ?.map((sch, i) => {
          //     const scoreAr = schemaScores[i]?.trim();
          //     const score = scoreAr ? arToEn(scoreAr) : null;
          //     return {
          //       title: sch.title,
          //       score,
          //       scoreAr,
          //     };
          //   })
          //   .filter((s) => s.score);
          scheme?.unshift({
            scoreAr: totalAr,
          } as any);
          return {
            title: s.title,
            subjectId: s.id,
            total,
            totalAr,
            scheme: scheme,
          };
        });
        const validScores = scoress.filter((s) => s.total).length;
        const printable = (validScores / scoress.length) * 100 > 60;
        console.log({
          printable,
          validScores,
          total: scores.length,
        });
        classData.students.push({
          firstName,
          surname,
          otherName,
          fullName,
          displayName: getDisplayName(firstName, surname, otherName),
          printable,
          scores: scoress,
          // .sort((a, b) => b.scheme?.length - a?.scheme?.length),
        });
      }
    });
  //   if (classData.class)
  store.insertClassData(classResult(classData));
  store.composeFinish();
  return { unformattedNames };
}
export function arToEn(arabicNum) {
  const arabicToEnglishMap = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };

  return arabicNum
    ?.split("")
    .map((char) => arabicToEnglishMap[char] || char)
    .join("");
}
export const enToAr = function (v) {
  return String(v).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
};

function classResult(classData: ClassData) {
  classData.students = classData.students.map((student) => {
    const totalScore = student.scores
      ?.map((s) => s.total as any)
      ?.filter(Boolean)
      .reduce((a, b) => a + b, 0);
    student.totalScore = totalScore;
    student.totalScoreAr = enToAr(totalScore);
    return student;
  });
  classData.students = classData.students.map((student) => {
    const positionIndex = classData.students.filter(
      (s) => s.totalScore >= student.totalScore,
    ).length;
    const samePosition = classData.students.filter(
      (s) => s.totalScore == student.totalScore,
    ).length;
    student.position =
      positionIndex - (samePosition > 1 ? samePosition - 1 : 0);
    student.positionAr = enToAr(student.position);
    return student;
  });
  classData.totalStudents = classData.students.length;
  return classData;
}
function classResultGpt(classData: ClassData) {
  // Calculate total scores and Arabic conversion in one map
  classData.students = classData.students.map((student) => {
    const totalScore =
      student.scores?.reduce((a, s) => a + (s.total || 0), 0) || 0;
    return {
      ...student,
      totalScore,
      totalScoreAr: enToAr(totalScore),
    };
  });

  // Sort once and calculate positions efficiently
  classData.students.sort((a, b) => b.totalScore - a.totalScore);

  let previousScore: number | null = null;
  let previousPosition = 0;

  classData.students = classData.students.map((student, index) => {
    if (student.totalScore !== previousScore) {
      previousPosition = index + 1;
      previousScore = student.totalScore;
    }
    return {
      ...student,
      position: previousPosition,
      positionAr: enToAr(previousPosition),
    };
  });

  return classData;
}
