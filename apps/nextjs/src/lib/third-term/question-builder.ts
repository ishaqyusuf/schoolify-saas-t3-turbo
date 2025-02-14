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
export const buildQuestion = (data) => {
  const spltd = data?.split("\n");
  let lines: {
    type: "instruction" | "question" | "grid";
    qNo?: string;
    grids?: { text: string; index: string }[];
    text?: string;
    styles?;
    align?: "center" | "right" | "left";
    options?: { text: string; index: string }[];
  }[] = [];

  spltd.map((ln) => {
    let [index, body] = ln?.split("'");
    if (body) {
      const [q, ...optns] = body.split("`");
      lines.push({
        qNo: index,
        type: "question",
        text: transformText(q),
        options: optns?.map((o, i) => ({
          index: optionIndex(i),
          text: transformText(o),
        })),
      });
      return;
    }
    const [_, centeredInstr] = ln?.split("__");
    if (ln?.trim()?.startsWith("__")) {
      lines.push({
        text: centeredInstr,
        align: "center",
        type: "instruction",
      });
      return;
    }
    const grids = ln?.split("_");
    if (grids.length > 1 || ln?.includes("،")) {
      lines.push({
        type: "grid",
        grids: grids.map((g, i) => {
          const [gInd, gTex] = g?.split(`،`);
          return {
            text: transformText(gTex || gInd),
            index: gTex ? gInd : null,
          };
        }),
      });
      return;
    }
    const spls = ln?.split("~");
    let styles = {};
    let texts = [];
    spls.map((s, i) => {
      const [st, v] = s?.split("-");
      if (v) {
        styles[st] = v;
      } else {
        //
        texts.push(s);
      }
    });
    // if (texts?.length) {
    lines.push({
      type: "question",
      text: texts[0],
      styles,
    });
    // }
  });
  return lines;
};
function optionIndex(i) {
  return [`ا`, "ب", "ج", "د", "ه", "و", "ز"][i];
}
function transformText(q) {
  const replc = {
    "...": ". . . . . . . . . . . . . . .",
    "..": ". . . . . . . . . .",
    ف٣: ". . . . . . . . . . . . . . .",
    "))": "»",
    ")": "»",
    "((": "«",
    "(": "«",

    // "..": ""
    // ".": ""
  };
  // ""?.replaceAll()
  Object.entries(replc).map(([s, r]) => (q = q?.replaceAll(s, r)));
  return q;
}
