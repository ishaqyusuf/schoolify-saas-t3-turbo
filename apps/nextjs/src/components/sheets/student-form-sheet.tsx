"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addStudentAction } from "actions/add-student-action";
import { addStudentSchema } from "actions/schema";
import { useAction } from "next-safe-action/hooks";

import { FormProvider } from "@acme/ui";
import { Button } from "@acme/ui/button";
import FormInput from "@acme/ui/controlled-inputs/form-input";
import { Form, useForm } from "@acme/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@acme/ui/sheet";

import { useStudentFormQuery } from "~/hooks/user-student-form-query";

export default function StudentFormSheet() {
  const ctx = useStudentFormQuery();

  const addForm = useAction(addStudentAction, {
    onSuccess(args) {
      console.log(args);

      ctx.setQuery(null);
    },
    onError(err) {
      console.log(err);
    },
  });
  const form = useForm({
    schema: addStudentSchema,
    defaultValues: {
      firstName: "",
      fathersName: "",
      otherName: "",
      classCode: "",
      classRoomId: null,
    },
  });
  useEffect(() => {
    if (ctx.addStudent) {
      form.reset({
        firstName: "",
        fathersName: "",
        otherName: "",
        classCode: ctx.classCode,
        classRoomId: ctx.classRoomId,
      });
    }
  }, [ctx.addStudent, ctx.classCode, ctx.classRoomId, form]);
  return (
    <Sheet
      open={ctx.addStudent}
      onOpenChange={(e) => {
        ctx.setQuery(null);
      }}
    >
      <SheetHeader>
        <SheetTitle></SheetTitle>
      </SheetHeader>
      <SheetContent>
        <FormProvider {...form}>
          <div className="grid gap-2">
            <FormInput control={form.control} name="firstName" label="Name" />
            <FormInput
              control={form.control}
              name="fathersName"
              label="Father's Name"
            />
            <FormInput
              control={form.control}
              name="otherName"
              label="Other Name"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                onClick={async (e) => {
                  form.trigger().then((va) => {
                    if (va) addForm.execute(form.getValues());
                  });
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
