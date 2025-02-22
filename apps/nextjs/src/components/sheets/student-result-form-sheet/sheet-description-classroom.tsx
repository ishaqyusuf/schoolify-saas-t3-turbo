import type { ClassRoomAssessmentForm } from "actions/get-classroom-assessment-form";
import type { GetStudentAssessmentForm } from "actions/get-student-assement-form";
import { useMemo } from "react";

import { Button } from "@acme/ui/button";
import { Icons } from "@acme/ui/common/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { SheetDescription } from "@acme/ui/sheet";

import { useStudentResultFormQuery } from "~/hooks/use-student-result-form-query";

export function ClassRoomControl({
  data,
  classRoomData,
}: {
  data: GetStudentAssessmentForm;
  classRoomData: ClassRoomAssessmentForm;
}) {
  const ctx = useStudentResultFormQuery();
  const control = useMemo(() => {
    const ls = classRoomData?.classList || [];
    const currentIndex = ls?.findIndex((a) => a.id == +ctx.classroomId);
    const resp = {
      nextId: currentIndex == -1 ? null : ls[currentIndex + 1]?.id,
      prevId: currentIndex == -1 ? null : ls[currentIndex - 1]?.id,
      classRoomTitle: ls[currentIndex]?.classTitle,
      classRoomList: ls,
    };
    return resp;
  }, [ctx.classroomId, classRoomData]);
  return (
    <SheetDescription>
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
          <span>{`${control.classRoomTitle}`}</span>
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
        <DropdownMenuContent className="max-h-[40vh]">
          {control.classRoomList?.map((classRoom) => (
            <DropdownMenuItem
              onClick={() => {
                ctx.setParams({
                  classroomId: String(classRoom.id),
                });
              }}
              key={classRoom.id}
            >
              {`${classRoom?.classTitle}`}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SheetDescription>
  );
}
