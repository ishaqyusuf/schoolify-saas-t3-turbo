"use client";

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

export function StudentAssessmentResultForm({}) {
  const ctx = useStudentResultFormQuery();
  const [data, setData] = useState<(typeof initForm)["result"]["data"]>();
  const [classRoomdata, setClassroomData] =
    useState<(typeof initClassRoom)["result"]["data"]>();
  const initClassRoom = useAction(getClassRoomAssessmentFormAction, {
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
      if (!classRoomdata) {
        if (args.data.classRoomData) {
          console.log("SETTING CLASSROOM");
          setClassroomData(args.data.classRoomData);
        } else {
          console.log("CLASSROOM DATA NOT LOADED");
        }
      }
    },
    onError(args) {
      //
    },
  });
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (ctx.isOpened) {
      startTransition(async () => {
        const result = await _getStudentAssessmentFormAction({
          parsedInput: {
            studentId: +ctx.params.studentId,
            subjectId: +ctx.params.subjectId,
            classRoomId: !classRoomdata ? +ctx.params.classroomId : null,
          },
        });
        setData(result);
      });
    }
  }, [
    ctx.isOpened,
    ctx.params.subjectId,
    ctx.params.studentId,
    ctx.params.classroomId,
  ]);
  // useEffect(() => {
  //   if (ctx.isOpened && ctx.params.classroomId) {
  //     initClassRoom.execute({
  //       classRoomId: +ctx.params.classroomId,
  //     });
  //   }
  // }, [ctx.params.classroomId, ctx.isOpened]);
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
