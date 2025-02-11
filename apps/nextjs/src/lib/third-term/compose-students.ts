import { arToEn } from "~/app/[domain]/exam-result-2/helper";
import { examStatus } from "./constants";
import { studentsData, studentsDataUpdated } from "./students-data";
import { getClassCode, getClassSubjectList } from "./utils";

interface Class {
  name: string;
  students: Student[];
  code;
  subjects: ReturnType<typeof getClassSubjectList>;
  subs: Class["subjects"][number]["subs"];
  subsCount;
}
interface PaymentStatus {
  status: "paid" | "part paid" | "pending" | "not applicable";
  paymentType: "fee" | "entrance";
  amountPaid?: number;
  amountPending?: number;
  term: "1st" | "2nd" | "3rd";
}
interface Student {
  studentId: number;
  studentClassId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  payments: PaymentStatus[];
  gender: "M" | "F";
  examStatus;
  quranClass?: QuranClass;
}
export const quranClasses = ["ق:تج", "ق:ح", "ق:أ", "ق:م", "ق:ج"] as const;
type QuranClass = NonNullable<typeof quranClasses>[number];
let studentId = 0;
let studentClassId = 0;
export const composeStudent = (rd) => {
  console.log({ rd });
  if (typeof rd !== "string") return [];
  studentId = 0;
  let cls: Class = null as any;
  const classList = [] as Class[];
  let gender: Student["gender"] = "M";
  rd.split("\n").map((line) => {
    if (line.includes("📃")) {
      if (cls) {
        classList.push({ ...cls });
        cls = null as any;
      }
      const clsName = line?.replace("📃", "")?.trim();
      const clsCode = getClassCode(clsName);
      cls = {
        name: clsName,
        students: [],
        code: clsCode,
        subjects: getClassSubjectList(clsCode as any),
        subs: [],
        subsCount: 0,
      };
      cls.subs = cls.subjects
        .map((a) => (a.subs.length ? a.subs : [null]))
        .flat() as any;
      gender = "M";
      studentClassId = 0;
      cls.subsCount = cls.subs?.filter(Boolean).length;
      return;
    }
    if (!line || ["-", "."].some((c) => !line?.replaceAll(c, "").trim())) {
      if (cls?.students?.length) gender = "F";
      return null;
    }
    const [name, ...params] = line?.includes(". ") ? line.split(". ") : [line];
    // console.log(name);
    let trimmedName = name?.split(".")?.filter(Boolean).join(".");

    if (!trimmedName) {
      if (cls?.students?.length) gender = "F";
      return null;
    }
    const nameSplt = trimmedName
      ?.split(trimmedName?.includes(".") ? "." : " ")
      ?.filter(Boolean);
    // if (nameSplt?.length > 2 || nameSplt?.length == 1 || !nameSplt?.length)
    //   console.log(trimmedName);
    const student: Student = {
      gender,
      studentClassId: (studentClassId += 1),
      studentId: (studentId += 1),
      firstName: nameSplt?.[0] as any,
      middleName: nameSplt?.[1],
      lastName: nameSplt?.[2] as any,
      payments: [],
      examStatus: "",
    };
    // console.log(student.studentClassId, student.studentId);
    params?.map((p) => {
      p = p.split(".").filter(Boolean).join(".")?.trim();
      if (quranClasses.includes(p as any)) {
        student.quranClass = p as any;
        return;
      }
      if (p == "م") {
        student.payments.push({
          paymentType: "fee",
          term: "3rd",
          status: "not applicable",
        });
        student.examStatus = examStatus.free;
        return;
      }
      if (p.startsWith("رس")) {
        const a = +arToEn(p.replace("رس", ""));
        student.payments.push({
          paymentType: "fee",
          status: a == 3000 ? "paid" : "paid",
          term: "2nd",
          amountPaid: a,
          amountPending: 3000 - a,
        });
        return;
      }
      if (p.startsWith("ر")) {
        const a = +arToEn(p.replace("ر", ""));
        student.payments.push({
          paymentType: "fee",
          status: a == 3000 ? "paid" : "part paid",
          term: "3rd",
          amountPaid: a,
          amountPending: 3000 - a,
        });
        student.examStatus = a == 3000 ? examStatus.paid : examStatus.permitted;
        return;
      }
      switch (p) {
        case "ق":
          student.payments.push({
            paymentType: "entrance",
            status: "paid",
            term: "3rd",
            amountPaid: 500,
          });
          return;
        case "ق*":
          student.payments.push({
            paymentType: "entrance",
            status: "pending",
            term: "3rd",
            amountPending: 500,
          });
          return;
        case "*":
          student.examStatus = examStatus.noStatus;
          return;
      }
    });
    cls.students.push(student);
  });
  if (cls) classList.push(cls);
  return classList;
};
