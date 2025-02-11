import { useEffect } from "react";
import { saveQuestionAction } from "actions/save-question-action";
import { parseAsBoolean, useQueryStates } from "nuqs";

import { FormProvider, useForm } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Icons } from "@acme/ui/common/icons";
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

import {
  classArray,
  classCodes,
  subjectsArray,
} from "~/lib/third-term/constants";
import { Data, dataStore } from "~/lib/third-term/store";

export const useStudentForm = () => {
  const [query, setQuery] = useQueryStates({
    editStudentData: parseAsBoolean,
  });
  return {
    isOpened: !!query.editStudentData,
    edit() {
      setQuery({
        editStudentData: true,
      });
    },
    close() {
      setQuery(null);
    },
  };
};

export function StudentDataFormSheet({}) {
  const ctx = useStudentForm();
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
      form.reset();
    }
  }, [ctx.isOpened]);
  //   const [subjects]
  return (
    <div>
      {" "}
      <Sheet open={ctx.isOpened} onOpenChange={ctx.close}>
        <SheetContent className="flex w-full flex-col p-2 pb-8 sm:w-1/2 sm:p-4">
          <SheetHeader>
            <SheetTitle>{"Edit Student Data"}</SheetTitle>
          </SheetHeader>
          <FormProvider {...form}>
            <div className="flex-1">
              <Label>Data</Label>
              <Textarea
                className="h-full"
                dir="rtl"
                {...form.register("data.raw")}
              />
            </div>
          </FormProvider>
          <SheetFooter className="flex">
            <div className="flex-1"></div>
            <Button className="">Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <div className="fixed bottom-0 right-0 m-4">
        <Button
          onClick={() => {
            ctx.edit();
          }}
        >
          <Icons.add className="size-4" />
        </Button>
      </div>
    </div>
  );
}
