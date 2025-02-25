import type { ResultEntries } from "actions/load-result-entries";
import Image from "next/image";
import { cva } from "class-variance-authority";

import { cn } from "@acme/ui";

import type { composeClassResult } from "~/lib/third-term/compose-student-result";
import { enToAr } from "~/app/[domain]/exam-result-2/helper";
import { configs } from "~/app/exam-result/data";
import { useResultPrintQuery } from "~/hooks/use-result-print-query";
import { composeStudentResult } from "~/lib/third-term/compose-student-result";
import ResultPrintHeader from "./result-print-header";

export interface ResultPrintStudentProps {
  data: ResultEntries[number];
  student: ReturnType<typeof composeClassResult>["students"][number];
  className;
  resultIndex;
}
const pagePrintStyle = cva("", {
  variants: {
    paperSize: {
      half: "h-[5.85in] space-y-2 pt-8",
      "half-packed": "pt-8s h-[5.85in] space-y-2",
      full: "h-[11.6in] space-y-8 pt-10",
    },
    paperPos: {
      top: "",
      bottom: "",
    },
    firsPage: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      paperSize: "half-packed",
      paperPos: "top",
      className: "h-[5.8in]",
    },
    {
      paperSize: "half-packed",
      paperPos: "bottom",
      firsPage: false,
      // className: "print:break-after-pages",
    },
    {
      paperSize: "half-packed",
      paperPos: "bottom",
      className: "h-[5.90in] pt-4",
    },
  ],
  defaultVariants: {
    paperSize: "full",
  },
});
export function ResultPrintStudent({
  data,
  className,
  student,
  resultIndex,
}: ResultPrintStudentProps) {
  const ctx = useResultPrintQuery();
  return (
    <div
      className={cn(className)}
      //   className={cn(student.result?.percentageAttendance < 60 && "hidden")}
    >
      <div
        className={cn(
          "flex flex-col overflow-hidden p-0",
          pagePrintStyle({
            ...(ctx as any),
            paperPos: resultIndex % 2 == 1 ? "bottom" : "top",
            firsPage:
              resultIndex == 0 || (ctx.paperSize != "full" && resultIndex < 2),
          }),
        )}
      >
        <ResultPrintHeader
          fasl={data.classTitle}
          data={data}
          student={student}
        />
        <div className="flex flex-col">
          {student.result.resultTable?.map((rt, i) => (
            <table
              className={cn(
                "result",
                i == 0 && "border-t border-muted-foreground",
                ctx?.paperSize,
              )}
              dir="rtl"
              key={i}
            >
              <thead>
                <tr>
                  <th>{i != 0 || <div className="text-right">المواد</div>}</th>
                  {rt[0].assessments.map((a) => (
                    <th align="center" className="w-32" key={a.id}>
                      <div className="text-center">
                        {a.title}

                        <span>{`  (${!a.obtainable ? "-" : enToAr(a.obtainable)})`}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rt.map((rt, i) => (
                  <tr key={rt.id}>
                    <td>
                      {`${enToAr(rt.index)}.  `}
                      {rt.classRoomSubject.subject.title}
                    </td>
                    {rt.assessments.map((aa) => (
                      <td align="center" key={aa.id}>
                        {aa.score ? enToAr(aa.score) : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
        {/* <div className="flex-1"></div> */}
        <div className="">
          <div className="space-y">
            <div
              className="border-b-2 border-dashed border-muted-foreground"
              dir="rtl"
            >
              <span className="font-bold"> {configs.comment}</span>
              <span className="px-4 text-lg">
                {student.result.comment.arabic}
              </span>
            </div>
            <div
              className="border-b-2 border-dashed border-muted-foreground"
              dir="ltr"
            >
              <span className="font-bold"> Comment:</span>

              <span className="px-4 text-lg">
                {student.result.comment.english}
              </span>
            </div>
          </div>
        </div>
        <div className={cn("print-px spb-8 pt-8s flex justify-between")}>
          {[configs.directorSignature, configs.teacherSignature].map(
            (c, ci) => (
              <div className="relative">
                <div className="h-[40px]">
                  {ci == 0 && (
                    <div className="-top-8s absolutes right-2">
                      <Image
                        alt=""
                        width={80}
                        height={80}
                        src={`/signature.png`}
                        className="object-fill"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
                <div
                  className="flex w-[120px] justify-center border-t border-dashed border-black/50"
                  key={ci}
                >
                  {c}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
