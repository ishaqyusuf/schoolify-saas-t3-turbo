"use client";

import { useEffect, useState } from "react";
import {
  getSubjectAssessmentFormAction,
  SubjectAssessmentForm,
} from "actions/get-subject-assessment-form";
import { saveQuestionAction } from "actions/save-question-action";

import { cn, Form, FormProvider, useForm } from "@acme/ui";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Icons } from "@acme/ui/common/icons";
import FormInput from "@acme/ui/controlled-inputs/form-input";
import FormSelect from "@acme/ui/controlled-inputs/form-select";
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

import { useSubjectAssessmentForm } from "~/hooks/use-subject-assessment-form";

export function SubjectAssessmentFormSheet({}) {
  const ctx = useSubjectAssessmentForm();
  const [data, setData] = useState<SubjectAssessmentForm>();
  const form = useForm({
    defaultValues: {
      opened: false,
      id: null,
      title: "",
      score: "",
    },
  });
  const formOpened = form.watch("opened");
  useEffect(() => {
    if (ctx.isOpened) {
      getSubjectAssessmentFormAction(+ctx.params.subjectId)
        .then((result) => {
          setData(result);
        })
        .catch((e) => {
          toast.error("Something went wrong");
          setData(null);
        });
    }
  }, [ctx.isOpened, ctx.params.subjectId]);
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
                  <TableCell>{a.title}</TableCell>
                  <TableCell>{a.obtainable}</TableCell>
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
                score: 0,
                title: "",
              });
            }}
            className=""
          >
            <Icons.add className="size-4" />
          </Button>
        </div>
        {/* <FormProvider {...form}>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                control={form.control}
                name="data.classCode"
                options={classArray}
                dir="rtl"
                label={"Class"}
              />
              <FormSelect
                control={form.control}
                name="data.subjectCode"
                options={subjectsArray}
                dir="rtl"
                label={"Subject"}
              />
            </div>
            <Label>Question</Label>
            <Textarea
              className={cn("h-full", arabic.className, "px-4 pb-16 text-lg")}
              dir="rtl"
              {...form.register("data.raw")}
            />
          </div>
        </FormProvider> */}
        {formOpened && (
          <SheetFooter className="flex flex-col">
            <FormProvider {...form}>
              <div>
                <FormInput
                  dir="rtl"
                  control={form.control}
                  label="Assessment Title"
                  name="title"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                {data?.assessmentSuggestions?.map((a) => (
                  <Badge key={a.title}>{a.title}</Badge>
                ))}
              </div>
            </FormProvider>
            <div className="flex">
              <div className="flex-1"></div>
              <Button className="">Save</Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
