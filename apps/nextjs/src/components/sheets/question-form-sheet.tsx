"use client";

import { useEffect } from "react";
import { saveQuestionAction } from "actions/save-question-action";

import { cn, FormProvider, useForm } from "@acme/ui";
import { Button } from "@acme/ui/button";
import FormSelect from "@acme/ui/controlled-inputs/form-select";
import { Label } from "@acme/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@acme/ui/sheet";
import { Textarea } from "@acme/ui/textarea";
import { toast } from "@acme/ui/toast";

import type { Data } from "~/lib/third-term/store";
import { arabic } from "~/fonts";
import { useQuestionForm } from "~/hooks/use-question-form";
import {
  classArray,
  classCodes,
  subjectsArray,
} from "~/lib/third-term/constants";
import { dataStore } from "~/lib/third-term/store";

export function QuestionFormSheet({}) {
  const ctx = useQuestionForm();
  const form = useForm({
    defaultValues: {
      id: null,
      data: {
        classCode: "",
        raw: ``,
        subjectCode: "",
      } as NonNullable<Data["questions"]>[number]["data"],
    },
  });
  const store = dataStore();
  async function save() {
    const data = form.getValues();
    const resp = await saveQuestionAction(data.id, data.data);
    ctx.close();
    let questions = [...(store.questions || [])];
    if (!data.id) questions.unshift(resp as any);
    else {
      questions = questions.map((q) => {
        if (q.id == resp.id) q.data = resp.data as any;
        return q;
      });
    }
    store.update("questions", questions);
    toast.success("Saved");
  }
  useEffect(() => {
    if (ctx.isOpened) {
      const eData = store.questions?.find((q) => ctx.questionId == q.id);

      form.reset(eData);
    }
  }, [ctx.isOpened, ctx.questionId]);
  //   const [subjects]
  return (
    <Sheet open={ctx.isOpened} onOpenChange={ctx.close}>
      <SheetContent className="flex w-full flex-col p-2 pb-8 sm:w-2/3 sm:p-4 lg:w-2/3">
        <SheetHeader>
          <SheetTitle>
            {ctx.questionId ? "Edit Question" : "Create Question"}
          </SheetTitle>
        </SheetHeader>
        <FormProvider {...form}>
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
              className={cn("h-full", arabic.className, "px-4 text-lg")}
              dir="rtl"
              {...form.register("data.raw")}
            />
          </div>
        </FormProvider>
        <SheetFooter className="flex">
          <div className="flex-1"></div>
          <Button onClick={save} className="">
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
