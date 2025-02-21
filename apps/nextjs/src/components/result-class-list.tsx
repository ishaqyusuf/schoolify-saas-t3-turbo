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
      <CollapsibleContent className="w-screen overflow-auto">
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
        <Table dir="rtl">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {data.subjects?.map((s) => (
                <TableHead colSpan={s.assessments?.length || 1} key={s.id}>
                  <span>{s.classRoomSubject?.subject?.title}</span>
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
