"use client";

import type { ResultEntries } from "actions/load-result-entries";
import { useState } from "react";
import { loadResultEntriesAction } from "actions/load-result-entries";

import { cn } from "@acme/ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@acme/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import { toast } from "@acme/ui/toast";

import { arabic } from "~/fonts";
import { useStudentResultFormQuery } from "~/hooks/use-student-result-form-query";
import { useSubjectAssessmentForm } from "~/hooks/use-subject-assessment-form";
import { assessmentShortTitle } from "~/lib/third-term/constants";

export default function ResultClassList({
  data,
}: {
  data: ResultEntries[number];
}) {
  const [subjectCode, setSubjectCode] = useState(null);
  const assmentForm = useSubjectAssessmentForm();
  const resultForm = useStudentResultFormQuery();
  function openStudentSubjectForm(studentId) {
    // const subject = data.subjects.find(
    //   (s) => s.classRoomSubject.subjectCode == subjectCode,
    // );
    // if (!subject) {
    //   toast.error("select subject");
    //   return;
    // }
    // if (!subject.assessments.length) {
    //   assmentForm.open(subject.id);
    //   return;
    // }
    resultForm.open(studentId, data.id);
  }
  return (
    <Collapsible dir="rtl" open className={cn(arabic.className)}>
      <CollapsibleTrigger className="p-2">
        <div className="">{data.classTitle}</div>
      </CollapsibleTrigger>
      <CollapsibleContent className="w-screen overflow-auto sm:px-8">
        <Select defaultValue={subjectCode} onValueChange={setSubjectCode}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {data.subjects?.map((s) => (
              <SelectItem key={s.id} value={s.classRoomSubject.subjectCode}>
                {s.classRoomSubject?.subject?.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="w-screen overflow-x-auto">
          <Table
            dir="rtl"
            className="table-fixeds w-screen table-auto sm:w-full"
          >
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 w-48 bg-white">
                  Name
                </TableHead>
                {data.subjects?.map((s) => (
                  <TableHead
                    className={cn(
                      s.assessments?.length == 1 && "",
                      s.assessments?.length == 2 && "",
                      s.assessments?.length == 3 && "w-36 border",
                    )}
                    align="center"
                    colSpan={s.assessments?.length || 1}
                    key={s.id}
                  >
                    <span className="text-center">
                      {s.classRoomSubject?.subject?.title}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
              <TableRow>
                <TableHead className="p-2"></TableHead>
                {data.subjects
                  .map((s) => s.assessments || [{} as any])
                  .flat()
                  ?.map((s) => (
                    <TableHead className="border p-2" key={s.id}>
                      <div>{assessmentShortTitle(s.title)}</div>
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.students?.map((s) => (
                <TableRow
                  onClick={() => {
                    openStudentSubjectForm(s.id);
                  }}
                  key={s.id}
                >
                  <TableCell className="sticky left-0 z-10 whitespace-nowrap bg-white">
                    {`${s.firstName} ${s.fathersName} ${s.otherName || ""}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
