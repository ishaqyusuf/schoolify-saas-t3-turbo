import { useEffect, useState } from "react";

import { _data, configs } from "./data";

export interface IClassResult {
  className: string;
  totalObtainable: number;
  totalstudents: number;
  Subjects: string[];
  pageSize: "full" | "half2" | "half";
  results: {
    rawName: string;
    studentName: string;
    firstName: string;
    otherName: string;
    surname: string;
    Subjects: { name: string; score: number }[];
    totalObtained?: number;
    position?: number;
    quran?: {
      title: string;
      mark: string;
    }[];
  }[];
}
export default function useDataTransform() {
  const [data, setData] = useState<IClassResult[]>([]);
  const [showClass, setShowClass] = useState("");
  const [showInput, setShowInput] = useState("");
  const [showNames, setShowNames] = useState("");
  useEffect(() => {
    setData(() => {
      return _data.map((d) => {
        const _resp: Partial<IClassResult> = {
          results: [],
          totalstudents: 0,
          pageSize: d.pageSize as any,
        };
        _resp.className = d.class;
        let Subjects = [];
        d.rawData.split("\n").map((line, index) => {
          const spl = line
            .replaceAll("،", ",")
            // .replaceAll(".", ",")
            .split(",")
            .map((c) => c.trim());
          if (index == 0) {
            Subjects = spl.slice(1);
            _resp.Subjects = Subjects;
            _resp.totalObtainable = 100 * Subjects.length;
          } else {
            _resp.totalstudents += 1;
            let totalScore = 0;
            const studentName = spl[0]?.split("-").splice(-1)[0];
            const dotted = studentName.includes(".");
            const splter = dotted ? "." : " ";
            const [firstName, ...restName] = studentName
              .split(splter)
              .map((s) => s.trim())
              .filter(Boolean);
            const surname = dotted ? restName[0] : restName.join(" ");
            const otherName = dotted ? restName[1] : null;
            let quran = null;
            _resp.results.push({
              rawName: studentName,
              studentName,
              firstName,
              surname,
              otherName,
              Subjects: Subjects.map((s, i) => {
                const scoreCol = spl[i + 1];
                if (scoreCol?.includes(";")) {
                  const [s1, s2, s3] = scoreCol.split(";");
                  const total = [s1, s2, s3]
                    .map((s) => Number(s))
                    .reduce((a, b) => a + b, 0);
                  quran = [
                    { title: configs.total, mark: total },
                    { title: configs.revision, mark: s3 },
                    { title: configs.recitation, mark: s2 },
                    { title: configs.hifz, mark: s1 },
                  ];
                  totalScore += Number(total);
                  return null;
                }
                const score = Number(arabicToEnglish(scoreCol)) || 0;
                totalScore += score;
                return {
                  name: s,
                  score,
                };
              }).filter(Boolean),
            });
            const index = _resp.results.length - 1;
            _resp.results[index].totalObtained = totalScore;
            _resp.results[index].quran = quran;
          }
        });
        return {
          ..._resp,
          results: _resp.results.map((r) => {
            const tops = _resp.results.filter(
              (res) => res.totalObtained > r.totalObtained,
            ).length;
            return {
              ...r,
              position: tops + 1,
            };
          }),
        };
      });
    });
  }, []);
  const [sortBy, setSortBy] = useState<"name" | "grade" | "none">("grade");
  function filtered() {
    return caligraphData()
      .filter((f) => {
        if (showInput) return showInput.includes(f.className);
        if (showClass && showClass != "All") {
          return f.className == showClass;
        }
        return true;
      })
      .map((da, i) => {
        return {
          ...da,
          results: da.results
            .filter(
              (r) =>
                r.totalObtained > 0 &&
                r.Subjects.filter((s) => s.score > 0).length > 1,
            )
            // .filter((r) => da.className == "الأول التمهيدي ا")
            // .filter((r) =>
            //   !showNames
            //     ? [`يوسف عبد الواسع`,`يسرى لقمان`]
            //         // .split(",")
            //         .some((rs) => compareArabicNames(rs, r.rawName))
            //     : true,
            // )
            .sort(
              sortBy == "name"
                ? (a, b) => a.studentName.localeCompare(b.studentName, ["ar"])
                : sortBy == "grade"
                  ? (a, b) => b.totalObtained - a.totalObtained
                  : undefined,
            ),
        };
      });
    // [].includes
  }
  function col(title, value, cols) {
    return { title, value, cols };
  }
  function arabicToEnglish(arabicNum) {
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
  const enToAr = function (v) {
    return String(v).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  };
  function caligraphData() {
    const uncals = [];
    const resp = data.map((cl) => {
      cl.results = cl.results.map((res) => {
        let name = res.studentName;
        const spl = name.split(" ").filter(Boolean);
        name = spl
          .map((s) => {
            const cal = configs.caligraphs[s];
            if (!cal) {
              if (!uncals.some((u) => u == s)) {
                uncals.push(s);
              }
            } else {
            }
            const ret = cal ? cal : s;
            return ret;
          })
          .join(" ");

        return {
          ...res,
          studentName: name,
          rawName: res.studentName,
        };
      });
      return cl;
    });

    return resp;
  }
  return {
    data,
    setSortBy,
    showInput,
    setShowInput,
    showClass,
    setShowClass,
    showNames,
    setShowNames,
    filtered,
    header: [
      col("العام الدراسي", "1445/1446هـ", 4),
      col(
        "اسم التلميذ/التلميذة",
        ({ result }: RenProps) => (
          <div className="text-xl">{result.studentName}</div>
        ),
        8,
      ),
      col("الدرجة", ({ result }) => enToAr(result.position), 2),
      col(
        "عدد الطلاب في الفصل",
        ({ result, fasl }: RenProps) => (
          <span>{enToAr(fasl.totalstudents)}</span>
        ),
        3,
      ),
      col("المجموع الكلي", ({ result }) => enToAr(result.totalObtained), 2),
      col("الفترة", "الأولى", 2),
      col("الفصل", ({ result, fasl }) => fasl.className, 3),
      //   col("الدرجة", (s) => s.position, 3),
    ],
    enToAr,
  };
}
function normalizeArabicName(name) {
  // Normalize the name by removing diacritics
  return name
    .normalize("NFKD") // Decompose combined characters (NFKD normalization)
    .replace(/[\u064B-\u065F]/g, "") // Remove Arabic diacritics (Tashkeel)
    .trim(); // Remove extra whitespace
}

function compareArabicNames(name1, name2) {
  const normalized1 = normalizeArabicName(name1);
  const normalized2 = normalizeArabicName(name2);

  return normalized1 === normalized2;
}
interface RenProps {
  result?;
  fasl?;
}
