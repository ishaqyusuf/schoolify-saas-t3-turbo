"use client";

import type { ClassRoomAssessmentForm } from "actions/get-classroom-assessment-form";
import type { GetStudentAssessmentForm } from "actions/get-student-assement-form";
import { useEffect, useState, useTransition } from "react";
import { getClassRoomAssessmentFormAction } from "actions/get-classroom-assessment-form";
import {
  _getStudentAssessmentFormAction,
  getStudentAssessmentFormAction,
} from "actions/get-student-assement-form";
import { useAction } from "next-safe-action/hooks";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@acme/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";

import { useStudentResultFormQuery } from "~/hooks/use-student-result-form-query";
import { AssessmentInput } from "./assessment-input";

export function StudentAssessmentResultForm() {
  const ctx = useStudentResultFormQuery();
  const [data, setData] = useState<GetStudentAssessmentForm>();
  const [classRoomdata, setClassroomData] = useState<ClassRoomAssessmentForm>();
  const { isOpened, studentId, subjectId, classroomId } = ctx;
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (isOpened && !data) {
      startTransition(async () => {
        const result = await _getStudentAssessmentFormAction({
          parsedInput: {
            studentId: +studentId,
            subjectId: +subjectId,
            classRoomId: +classroomId,
          },
        });
        setData(result);
        setClassroomData(result.classRoomData);
      });
    }
  }, [isOpened, studentId, subjectId, classroomId, data]);
  useEffect(() => {
    if (data) {
      startTransition(async () => {
        const result = await _getStudentAssessmentFormAction({
          parsedInput: {
            studentId: +studentId,
            subjectId: +subjectId,
            // classRoomId: +classroomId,
          },
        });
        setData(result);
        // setClassroomData(result.classRoomData);
      });
    }
  }, [studentId, data, subjectId]);
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
                  <DropdownMenuItem
                    onClick={() => {
                      ctx.setParams({
                        studentId: String(student.id),
                      });
                    }}
                    key={student.id}
                  >
                    {`${student.firstName} ${student.fathersName} ${student.otherName || ""}`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SheetTitle>
        </SheetHeader>
        {isPending ? (
          <></>
        ) : (
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
                        .map((a, ai) => (
                          <TableCell key={ai}>
                            <AssessmentInput
                              subjectAssessment={a}
                              studentData={data}
                            />
                          </TableCell>
                        ))}
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {/* <TableFooter></TableFooter> */}
              </Table>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
