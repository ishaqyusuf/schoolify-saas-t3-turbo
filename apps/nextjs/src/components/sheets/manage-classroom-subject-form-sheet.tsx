"use client";

import type { ClassRoomSubjectManager } from "actions/get-classroom-subject-manager";
import type { SubjectAssessmentForm } from "actions/get-subject-assessment-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addSubjectAction } from "actions/add-subject-action";
import { deleteSubjectAssessmentAction } from "actions/delete-subject-assessment-action";
import { getClassroomSubjectManager } from "actions/get-classroom-subject-manager";
import { getSubjectAssessmentFormAction } from "actions/get-subject-assessment-form";
import { saveSubjectAssessmentAction } from "actions/save-subject-assessment";
import { saveJobAssessmentSchema } from "actions/schema";
import { useAction } from "next-safe-action/hooks";

import { FormProvider, useForm } from "@acme/ui";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@acme/ui/collapsible";
import { Icons } from "@acme/ui/common/icons";
import FormInput from "@acme/ui/controlled-inputs/form-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { ScrollArea } from "@acme/ui/scroll-area";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import { toast } from "@acme/ui/toast";

import { useManageClassroomSubjectQuery } from "~/hooks/use-manage-classroom-subject-query";
import { subjectsByCode } from "~/lib/third-term/constants";

export function ManageClassroomSubjectFormSheet() {
  const ctx = useManageClassroomSubjectQuery();
  const [data, setData] = useState<ClassRoomSubjectManager>();

  useEffect(() => {
    if (ctx.isOpened) {
      getClassroomSubjectManager(+ctx.manageClassroomId)
        .then((result) => {
          setData(result);
        })
        .catch((e) => {
          setData(null);
        });
    }
  }, [ctx.isOpened, ctx.manageClassroomId]);
  const subjects = Object.entries(subjectsByCode).map(([value, label]) => ({
    label,
    value,
  }));
  const addSubject = useAction(addSubjectAction, {
    onSuccess(args) {
      setData((current) => {
        const d = { ...current };
        console.log(args.data);

        d.classroom.subjects.push(args.data);
      });
    },
    // onExecute(args) {},
  });
  async function _addSubject(code, title) {
    const ex = data.classroom.subjects.find(
      (s) => s.classRoomSubject.subjectCode == code,
    );
    if (ex) {
      console.log(ex);
      toast.error("Already added");
      return;
    }
    addSubject.execute({
      code,
      title,
      classRoomId: data.classroom.id,
      classGroupCode: data.classroom.classGroupCode,
    });
  }
  const saveSubjectAssessment = useAction(saveSubjectAssessmentAction, {
    onSuccess(args) {
      setData((currnet) => {
        const newData = { ...currnet };
        const index = newData.classroom.subjects.findIndex(
          (s) => s.id == args.input.subjectsOnClassRoomsId,
        );
        newData.classroom.subjects[index].assessments.push(args.data);
        // newData.assessments.unshift(args.data as any);
        return newData;
      });
      toast.success("Saved");
    },
    onError(args) {
      toast.error("Error");
    },
  });
  if (!data) return null;
  return (
    <Sheet open={ctx.isOpened} onOpenChange={ctx.close}>
      <SheetContent className="flex w-full flex-col p-2 pb-8 sm:w-2/3 sm:p-4 lg:w-2/3">
        <SheetHeader>
          <SheetTitle>{data.classroom.classTitle}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          {data.classroom.subjects.map((subject) => (
            <Collapsible className="border-b">
              <CollapsibleTrigger className="flex w-full" dir="rtl">
                <div className="">{subject.classRoomSubject.subject.title}</div>
                <div className="flex-1"></div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {/* {subject.assessments?.} */}
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Obtainable</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subject.assessments.map((aa) => (
                      <TableRow key={aa.id}>
                        <TableCell>{aa.title}</TableCell>
                        <TableCell>{aa.obtainable}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="">
                    <Button className="">
                      <Icons.add className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <ScrollArea className="h-[40vh]">
                      {data.assessments?.map((s) => (
                        <DropdownMenuItem
                          onClick={() => {
                            const exists = subject.assessments.find(
                              (_s) => _s.title?.localeCompare(s.title) == 0,
                            );
                            if (exists) {
                              toast.error("Already exists");
                              return;
                            }
                            saveSubjectAssessment.execute({
                              obtainable: String(s.obtainable),
                              subjectsOnClassRoomsId: subject.id,
                              title: s.title,
                            });
                            // _addSubject(s., s.label);
                          }}
                          dir="rtl"
                          key={s.id}
                        >
                          {s.title} {`(${s.obtainable})`}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CollapsibleContent>
            </Collapsible>
          ))}
          <div className="flex-1 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="">
                <Button className="">
                  <Icons.add className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <ScrollArea className="h-[40vh]">
                  {subjects?.map((s) => (
                    <DropdownMenuItem
                      onClick={() => {
                        _addSubject(s.value, s.label);
                      }}
                      dir="rtl"
                      key={s.value}
                    >
                      {s.label}
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
