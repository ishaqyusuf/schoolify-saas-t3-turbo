"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteSubjectAssessmentAction } from "actions/delete-subject-assessment-action";
import { getClassRoomAssessmentForm } from "actions/get-classroom-assessment-form";
import { getStudentAssessmentFormAction } from "actions/get-student-assement-form";
import {
  getSubjectAssessmentFormAction,
  SubjectAssessmentForm,
} from "actions/get-subject-assessment-form";
import { saveJobAssessmentAction } from "actions/save-subject-assessment";
import { saveJobAssessmentSchema } from "actions/schema";
import { useAction } from "next-safe-action/hooks";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { Label } from "@acme/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@acme/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import { toast } from "@acme/ui/toast";

import { useStudentResultFormQuery } from "~/hooks/use-student-result-form-query";

export function StudentAssessmentResultForm({}) {
  const ctx = useStudentResultFormQuery();
  const [data, setData] = useState<(typeof initForm)["result"]["data"]>();
  const [classRoomdata, setClassroomData] =
    useState<(typeof initClassRoom)["result"]["data"]>();
  const initClassRoom = useAction(getClassRoomAssessmentForm, {
    onSuccess(args) {
      console.log(args.data);
      setClassroomData(args.data);
    },
    onError(args) {},
  });
  const initForm = useAction(getStudentAssessmentFormAction, {
    onSuccess(args) {
      console.log(args.data);
      setData(args.data);
    },
    onError(args) {},
  });
  useEffect(() => {
    if (ctx.isOpened) {
      initClassRoom.execute({
        classRoomId: +ctx.params.classroomId,
      });
      initForm.execute({
        studentId: +ctx.params.studentId,
        subjectId: +ctx.params.subjectId,
        classRoomId: +ctx.params.classroomId,
      });
    }
  }, [
    ctx.isOpened,
    ctx.params.subjectId,
    ctx.params.studentId,
    ctx.params.classroomId,
  ]);
  useEffect(() => {
    if (ctx.isOpened && ctx.params.classroomId) {
      initClassRoom.execute({
        classRoomId: +ctx.params.classroomId,
      });
    }
  }, [ctx.params.classroomId, ctx.isOpened]);
  if (!data) return null;
  return (
    <Sheet open={ctx.isOpened} onOpenChange={ctx.close}>
      <SheetContent className="flex w-full flex-col p-2 pb-8 sm:w-2/3 sm:p-4 lg:w-2/3">
        <SheetHeader>
          <SheetTitle>
            <DropdownMenu>
              <DropdownMenuTrigger>
                {`${data.firstName} ${data.fathersName} ${data.otherName || ""}`}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-[40vh]">
                {classRoomdata?.classRoom?.students?.map((student) => (
                  <DropdownMenuItem key={student.id}>
                    {`${student.firstName} ${student.fathersName} ${student.otherName || ""}`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          {classRoomdata?.groupedAssessments?.map((gr, i) => (
            <Table key={i} dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  {gr.assessmentNames
                    .filter((a) => a.obtainable)
                    ?.map((a, ai) => (
                      <TableHead key={ai}>
                        {a.title}
                        <span>{`(${a.obtainable})`}</span>
                      </TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {gr?.subjects?.map((subject, index) => (
                  <TableRow key={subject.id}>
                    <TableCell>
                      {`${index}. `}
                      {subject?.classRoomSubject?.subject?.title}
                    </TableCell>
                    {subject.assessments
                      ?.filter((a) => a.obtainable)
                      .map((a, ai) => <TableCell key={ai}></TableCell>)}
                    <TableCell></TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {/* <TableFooter></TableFooter> */}
            </Table>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
