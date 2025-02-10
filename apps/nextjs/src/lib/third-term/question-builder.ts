import {
  classByCodes,
  ClassCodes,
  SubjectCodes,
  subjectsByCode,
} from "./constants";

export const questionBuilder = () => {
  let obj: {
    questions: {
      subject?: string;
      questionLines?: {
        text: string;
        qNo?: string;
        options?: { label?: string; text?: string }[];
        type?: "question" | "instruction" | "sub-question";
        align?: "center" | "right";
        size?: "sm" | "md" | "lg";
        rightMargin?: "sm" | "md" | "default";
      }[];
      paperSize?: "full" | "half" | "1/3";
    }[];
    class?: string;
  }[] = [];
  let classQtn: (typeof obj)[number] = {
    questions: [],
  };
  let q: (typeof obj)[number]["questions"][number] = null as any;
  const ctx = {
    questions: q,
    classQuestions: obj,
    csv(value) {
      value?.split("\n").map((l) => {
        l = l.replaceAll(",,", "|");
        const [num, qtn, ...opts] = l.split(",");
        if (opts.length || qtn) {
          q.questionLines?.push({
            type: "question",
            qNo: num,
            text: qtn,
            options: opts?.map((o) => {
              const [t, _l] = o.split(";");
              return {
                label: t,
                text: _l,
              };
            }),
          });
          return;
        }
        q.questionLines?.push({
          text: l?.split("_")?.filter(Boolean).join(""),
          type: l?.includes("_") ? "sub-question" : "instruction",
        });
      });
      return ctx;
    },
    save() {
      //   if (q) {
      if (q) {
        console.log(q);

        classQtn.questions.push({ ...q });
        q = {};
      }
      obj.push(classQtn);

      // obj.questions.push({ ...q });
      // q = {};
      //   }
      return ctx;
    },
    new(subject: SubjectCodes, paperSize: (typeof q)["paperSize"]) {
      if (q) {
        classQtn.questions.push({ ...q });
        q = {};
      }
      q = {
        subject: subjectsByCode[subject],
        paperSize,
        questionLines: [],
      };
      return ctx;
    },
    subject(value) {
      q.subject = value;
      return ctx;
    },
    class(value: ClassCodes) {
      if (classQtn) obj.push({ ...classQtn });
      classQtn = {
        questions: [],
        class: classByCodes[value],
      };
      return ctx;
    },
  };
  return ctx;
};
