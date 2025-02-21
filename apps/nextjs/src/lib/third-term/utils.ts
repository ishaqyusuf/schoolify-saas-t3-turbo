import type { ClassCodes } from "./constants";
import { classByCodes, classSubjectsByCode, subjectsByCode } from "./constants";

export function getClassCode(name) {
  const res = Object.entries(classByCodes).find(
    ([code, cName]) => cName === name,
  );
  if (res) console.log({ name, res });

  return res?.[0];
}
export function getClassSubjectList(classCode: ClassCodes) {
  const ls: {
    code;
    name;
    subs: { title; mark }[];
  }[] = classSubjectsByCode[classCode]?.map((subjectCode) => {
    return {
      code: subjectCode,
      name: subjectsByCode[subjectCode],
      subs:
        subjectCode == "QUR" &&
        (["ibtidaai", "ibtidaai2"] as ClassCodes[]).includes(classCode)
          ? [
              { title: subjectsByCode.HIFZ, mark: "(٣٠)" },
              { title: subjectsByCode.QIR, mark: "(٣٠)" },
              { title: subjectsByCode.MUR, mark: "(٤٠)" },
            ]
          : [],
    };
  });
  return ls;
}
