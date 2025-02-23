"use client";

import type { SubjectAssessmentForm } from "actions/get-subject-assessment-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteSubjectAssessmentAction } from "actions/delete-subject-assessment-action";
import { getSubjectAssessmentFormAction } from "actions/get-subject-assessment-form";
import { saveSubjectAssessmentAction } from "actions/save-subject-assessment";
import { saveJobAssessmentSchema } from "actions/schema";
import { useAction } from "next-safe-action/hooks";

import { FormProvider, useForm } from "@acme/ui";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Icons } from "@acme/ui/common/icons";
import FormInput from "@acme/ui/controlled-inputs/form-input";
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

import { useSubjectAssessmentForm } from "~/hooks/use-subject-assessment-form";

export function SubjectAssessmentFormSheet({}) {
  const ctx = useSubjectAssessmentForm();
  const [data, setData] = useState<SubjectAssessmentForm>();
  const form = useForm({
    resolver: zodResolver(saveJobAssessmentSchema),
    defaultValues: {
      opened: false,
      id: null,
      title: "",
      obtainable: "",
      subjectsOnClassRoomsId: null,
    },
  });
  const formOpened = form.watch("opened");
  useEffect(() => {
    if (ctx.isOpened) {
      getSubjectAssessmentFormAction(+ctx.params.subjectId)
        .then((result) => {
          setData(result);
          form.reset({
            opened: false,
            subjectsOnClassRoomsId: +ctx.params.subjectId,
          });
        })
        .catch((e) => {
          toast.error("Something went wrong");
          setData(null);
        });
    }
  }, [ctx.isOpened, ctx.params.subjectId]);
  const deleteAssessment = useAction(deleteSubjectAssessmentAction, {
    onSuccess(args) {
      setData((d) => {
        const nd = { ...d };
        nd.assessments = nd.assessments.filter((a) => a.id != args.input.id);
      });
      return nd as any;
    },
  });
  const saveForm = useAction(saveSubjectAssessmentAction, {
    onSuccess(args) {
      setData((currnet) => {
        const newData = { ...currnet };
        newData.assessments.unshift(args.data as any);
        return newData;
      });
      form.reset({
        opened: false,
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
          <SheetTitle>{data.classRoom.classTitle}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.assessments?.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    {`${a.id}. `}
                    {a.title}
                  </TableCell>
                  <TableCell>{a.obtainable}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={(s) => {
                        deleteAssessment.execute({
                          id: a.id,
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {/* <TableFooter></TableFooter> */}
          </Table>
          <Button
            onClick={(e) => {
              form.reset({
                opened: true,
                id: null,
                obtainable: "",
                title: "",
                subjectsOnClassRoomsId: +ctx.params.subjectId,
              });
            }}
            className=""
          >
            <Icons.add className="size-4" />
          </Button>
        </div>

        {formOpened && (
          <SheetFooter className="flex flex-col">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(saveForm.execute)}>
                <div className="flex flex-col gap-4">
                  <FormInput
                    dir="rtl"
                    control={form.control}
                    label="Assessment Title"
                    name="title"
                  />
                  <FormInput
                    dir="rtl"
                    control={form.control}
                    label="Obtainable"
                    name="obtainable"
                  />
                  <div className="flex flex-wrap gap-4">
                    {data?.assessmentSuggestions?.map((a) => (
                      <Badge
                        onClick={() => {
                          form.setValue("obtainable", String(a.obtainable));
                          form.setValue("title", a.title);
                        }}
                        key={a.title}
                      >
                        {a.title}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-1"></div>
                  <Button type="submit" className="">
                    Save
                  </Button>
                </div>
              </form>
            </FormProvider>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
