import Image from "next/image";
import { ResultEntries } from "actions/load-result-entries";

import { cn } from "@acme/ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@acme/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";

import { enToAr } from "~/app/[domain]/exam-result-2/helper";
import { configs } from "~/app/exam-result/data";
import {
  composeClassResult,
  composeStudentResult,
} from "~/lib/third-term/compose-student-result";
import ResultPrintHeader from "./result-print-header";

export interface ResultPrintStudentProps {
  data: ResultEntries[number];
  student: ReturnType<typeof composeClassResult>["students"][number];
  className;
}
export function ResultPrintStudent({
  data,
  className,
  student,
}: ResultPrintStudentProps) {
  return (
    <div
      className={cn(className)}
      //   className={cn(student.result?.percentageAttendance < 60 && "hidden")}
    >
      <div
        className={cn(
          "flex h-[5.85in] flex-col space-y-2 overflow-hidden p-0 pt-8",
        )}
      >
        <ResultPrintHeader
          fasl={data.classTitle}
          data={data}
          student={student}
        />
        {student.result.resultTable?.map((rt, i) => (
          <table className="result overflow-hidden" dir="rtl" key={i}>
            <thead>
              <tr>
                <th>
                  <div className="text-right">المواد</div>
                </th>
                {rt[0].assessments.map((a) => (
                  <th align="center" key={a.id}>
                    <div className="text-center">{a.title}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rt.map((rt, i) => (
                <tr key={rt.id}>
                  <td>
                    {`${enToAr(i + 1)}.  `}
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
