import { useEffect } from "react";
import { saveQuestionAction } from "actions/save-question-action";
import { saveStudentDataAction } from "actions/save-student-data-action";
import { parseAsBoolean, useQueryStates } from "nuqs";

import { cn, FormProvider, useForm } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Icons } from "@acme/ui/common/icons";
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

import { arabic } from "~/fonts";
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
      raw: ``,
    },
  });
  const store = dataStore();
  async function save() {
    const data = form.getValues();
    const resp = await saveStudentDataAction(data.id, data.raw);
    ctx.close();
    store.update("studentData.raw", data.raw as any);
    store.update("studentData.id", resp.id);

    toast.success("Saved");
  }
  useEffect(() => {
    if (ctx.isOpened) {
      form.reset({
        raw: store.studentData?.raw,
        id: store.studentData?.id,
      });
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
                autoCorrect="off"
                spellCheck="false"
                className={cn("h-full", arabic.className)}
                dir="rtl"
                {...form.register("raw")}
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
