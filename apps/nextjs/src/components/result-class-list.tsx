"use client";

import { useState } from "react";
import {
  loadResultEntriesAction,
  ResultEntries,
} from "actions/load-result-entries";

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
import { useSubjectAssessmentForm } from "~/hooks/use-subject-assessment-form";
import { assessmentShortTitle } from "~/lib/third-term/constants";

export default function ResultClassList({
  data,
}: {
  data: ResultEntries[number];
}) {
  const [subjectCode, setSubjectCode] = useState(null);
  const assmentForm = useSubjectAssessmentForm();
  function openStudentSubjectForm(studentId) {
    const subject = data.subjects.find(
      (s) => s.classRoomSubject.subjectCode == subjectCode,
    );
    if (!subject) {
      toast.error("select subject");
      return;
    }
    if (!subject.assessments.length) {
      assmentForm.open(subject.id);
    }
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
              <SelectItem value={s.classRoomSubject.subjectCode}>
                {s.classRoomSubject?.subject?.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Table dir="rtl" className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="">Name</TableHead>
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
                <TableCell>
                  {`${s.firstName} ${s.fathersName} ${s.otherName || ""}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CollapsibleContent>
    </Collapsible>
  );
}
