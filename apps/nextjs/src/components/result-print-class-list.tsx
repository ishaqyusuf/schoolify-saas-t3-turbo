"use client";

import type { ResultEntries } from "actions/load-result-entries";
import { Fragment, useEffect, useState } from "react";

import { cn } from "@acme/ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@acme/ui/collapsible";
import { Icons } from "@acme/ui/common/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";

import { enToAr } from "~/app/[domain]/exam-result-2/helper";
import { arabic } from "~/fonts";
import { useManageClassroomSubjectQuery } from "~/hooks/use-manage-classroom-subject-query";
import { useResultPrintQuery } from "~/hooks/use-result-print-query";
import { useStudentResultFormQuery } from "~/hooks/use-student-result-form-query";
import { composeClassResult } from "~/lib/third-term/compose-student-result";
import { ResultPrintStudent } from "./result-print-student";

export default function ResultPrintClassList({
  data,
}: {
  data: ResultEntries[number];
}) {
  const [subjectCode, setSubjectCode] = useState(null);
  const printQuery = useResultPrintQuery();

  const composedData = composeClassResult(data);

  const [opened, openChanged] = useState(false);
  const manageClassroom = useManageClassroomSubjectQuery();
  if (
    printQuery.classCodes &&
    !printQuery.classCodes?.split(",").includes(data.classCode)
  )
    return null;
  return (
    <Collapsible
      dir="rtl"
      open={opened}
      onOpenChange={openChanged}
      className={cn(arabic.className, "border-b")}
    >
      <div className="flex w-full gap-2 print:hidden">
        <CollapsibleTrigger className="flex w-full p-2">
          <div className="">{data.classTitle}</div>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="overflow-auto sm:px-8">
        {composedData.students.map((student, index) => (
          <ResultPrintStudent
            student={student}
            data={data}
            key={student.id}
            className={cn(
              index > 1 && index % 2 == 1 && "print:break-after-pages",

              index % 2 == 1 &&
                "border-t-2 border-dashed border-muted-foreground",
            )}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
interface ResultCellProps {
  student: ResultEntries[number]["students"][number];
  assessment: ResultEntries[number]["subjects"][number]["assessments"][number];
}
function ResultCell({ student, assessment }: ResultCellProps) {
  const result = student?.assessmentResults?.find(
    (a) => assessment.id == a.classSubjectAssessmentId,
  );
  if (result) console.log({ result });
  return (
    <TableCell className="p-1">
      {result?.obtained ? enToAr(result?.obtained) : "-"}
    </TableCell>
  );
}
