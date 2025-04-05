import type { ClassRoomAssessmentForm } from "actions/example/get-classroom-assessment-form";
import type { GetStudentAssessmentForm } from "actions/example/get-student-assement-form";
import { useMemo } from "react";

import { Button } from "@acme/ui/button";
import { Icons } from "@acme/ui/common/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { ScrollArea } from "@acme/ui/scroll-area";
import { SheetTitle } from "@acme/ui/sheet";

import { useStudentResultFormQuery } from "~/hooks/use-student-result-form-query";

export function StudentNameControl({
  data,
  classRoomData,
}: {
  data: GetStudentAssessmentForm;
  classRoomData: ClassRoomAssessmentForm;
}) {
  const ctx = useStudentResultFormQuery();
  const control = useMemo(() => {
    const currentIndex = classRoomData?.classRoom?.students?.findIndex(
      (a) => a.id == +ctx.studentId,
    );

    const resp = {
      nextId:
        currentIndex == -1
          ? null
          : classRoomData?.classRoom?.students[currentIndex + 1]?.id,
      prevId:
        currentIndex == -1
          ? null
          : classRoomData?.classRoom?.students[currentIndex - 1]?.id,
    };
    console.log(resp);
    return resp;
  }, [ctx.studentId, classRoomData]);
  return (
    <SheetTitle>
      <DropdownMenu>
        <Button
          onClick={() => {
            ctx.setParams({
              studentId: String(control.prevId),
            });
          }}
          disabled={!control.prevId}
          size="sm"
          variant="ghost"
        >
          <Icons.chevronLeft className="size-4" />
        </Button>
        <DropdownMenuTrigger className="inline-flex items-center gap-4">
          <span>
            {`${data.firstName} ${data.fathersName} ${data.otherName || ""}`}
          </span>
        </DropdownMenuTrigger>
        <Button
          onClick={() => {
            ctx.setParams({
              studentId: String(control.nextId),
            });
          }}
          disabled={!control.nextId}
          size="sm"
          variant="ghost"
        >
          <Icons.chevronRight className="size-4" />
        </Button>
        <DropdownMenuContent className="">
          <ScrollArea className="h-[40vh]">
            {classRoomData?.classRoom?.students?.map((student) => (
              <DropdownMenuItem
                dir="rtl"
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
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </SheetTitle>
  );
}
