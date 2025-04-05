"use client";

import type { ClassRoomAssessmentForm } from "actions/example/get-classroom-assessment-form";
import type { GetStudentAssessmentForm } from "actions/example/get-student-assement-form";
import { useEffect, useState, useTransition } from "react";
import { _getStudentAssessmentFormAction } from "actions/example/get-student-assement-form";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { ScrollArea } from "@acme/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@acme/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import { generateRandomString } from "@acme/utils";

import { enToAr } from "~/app/[domain]/exam-result-2/helper";
import { useStudentResultFormQuery } from "~/hooks/use-student-result-form-query";
import { AssessmentInput } from "./assessment-input";
import { ClassRoomControl } from "./sheet-description-classroom";
import { StudentNameControl } from "./student-name-control";

export function StudentAssessmentResultForm() {
  const ctx = useStudentResultFormQuery();
  const [data, setData] = useState<GetStudentAssessmentForm>();
  const [classRoomdata, setClassroomData] = useState<ClassRoomAssessmentForm>();
  const { isOpened, studentId, classroomId } = ctx;
  const [isPending, startTransition] = useTransition();
  const [triggerFreshDataToken, setTriggerFreshDataToken] = useState(null);
  useEffect(() => {
    if (isOpened && triggerFreshDataToken) {
      startTransition(async () => {
        const result = await _getStudentAssessmentFormAction({
          parsedInput: {
            studentId: +studentId,
            classRoomId: +classroomId,
          },
        });
        console.log(result);

        setData(result);
        setClassroomData(result.classRoomData);
        setTriggerFreshDataToken(null);
      });
    }
  }, [isOpened, triggerFreshDataToken, studentId, classroomId]);
  useEffect(() => {
    if (isOpened)
      setTimeout(() => {
        setTriggerFreshDataToken(generateRandomString());
      }, 100);
  }, [isOpened]);
  useEffect(() => {
    if (!triggerFreshDataToken)
      startTransition(async () => {
        const result = await _getStudentAssessmentFormAction({
          parsedInput: {
            studentId: +studentId,
            // subjectId: +subjectId,
            // classRoomId: +classroomId,
          },
        });
        setData(result);
        // setClassroomData(result.classRoomData);
      });
  }, [studentId, triggerFreshDataToken]);
  if (!data) return null;
  return (
    <Sheet open={ctx.isOpened} onOpenChange={ctx.close}>
      <SheetContent className="flex w-full flex-col p-2 pb-8 sm:w-2/3 sm:p-4 lg:w-2/3">
        <SheetHeader className="border-b">
          <StudentNameControl data={data} classRoomData={classRoomdata} />
          <ClassRoomControl
            onChange={(e) => {
              setTriggerFreshDataToken(generateRandomString());
            }}
            data={data}
            classRoomData={classRoomdata}
          />
        </SheetHeader>
        {isPending ? (
          <></>
        ) : (
          <ScrollArea className="sm:pb-auto flex-1 overflow-auto pb-[20vh]">
            {classRoomdata?.groupedAssessments?.map((gr, i) => (
              <Table className="compact" key={i} dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    {gr.assessmentNames
                      .filter((a) => a.obtainable)
                      ?.map((a, ai) => (
                        <TableHead key={ai}>
                          {a.title}
                          <span>{`(${enToAr(a.obtainable)})`}</span>
                        </TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gr?.subjects?.map((subject, index) => (
                    <TableRow key={subject.id}>
                      <TableCell>
                        {`${enToAr(index + 1)}. `}
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
              </Table>
            ))}
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
