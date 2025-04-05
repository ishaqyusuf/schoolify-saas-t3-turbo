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
import { SheetDescription } from "@acme/ui/sheet";

import { useStudentResultFormQuery } from "~/hooks/use-student-result-form-query";

export function ClassRoomControl({
  data,
  classRoomData,
  onChange,
}: {
  data: GetStudentAssessmentForm;
  classRoomData: ClassRoomAssessmentForm;
  onChange;
}) {
  const ctx = useStudentResultFormQuery();
  const control = useMemo(() => {
    const ls = classRoomData?.classList || [];
    const currentIndex = ls?.findIndex((a) => a.id == +ctx.classroomId);
    const resp = {
      nextId:
        currentIndex == -1
          ? null
          : {
              classRoomId: ls[currentIndex + 1]?.id,
              studentId: ls[currentIndex + 1]?.students?.[0]?.id,
            },
      prevId:
        currentIndex == -1
          ? null
          : {
              classRoomId: ls[currentIndex - 1]?.id,
              studentId: ls[currentIndex - 1]?.students?.[0]?.id,
            },
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
            onChange();
            ctx.setParams(
              {
                ...(control.prevId || ({} as any)),
              },
              {},
            );
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
            onChange();
            ctx.setParams(
              {
                ...(control.nextId || ({} as any)),
              },
              {},
            );
          }}
          disabled={!control.nextId}
          size="sm"
          variant="ghost"
        >
          <Icons.chevronRight className="size-4" />
        </Button>
        <DropdownMenuContent className="">
          <ScrollArea className="h-[40vh]">
            {control.classRoomList?.map((classRoom) => (
              <DropdownMenuItem
                onClick={() => {
                  onChange();
                  ctx.setParams(
                    {
                      classroomId: String(classRoom.id),
                      studentId: String(classRoom.students?.[0]?.id),
                    },
                    {},
                  );
                }}
                key={classRoom.id}
              >
                {`${classRoom?.classTitle}`}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </SheetDescription>
  );
}
