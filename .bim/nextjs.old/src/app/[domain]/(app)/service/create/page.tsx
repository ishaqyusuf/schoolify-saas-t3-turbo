"use client";

import { revalidatePath } from "next/cache";

import {
  CreateBillableServiceSchema,
  CreateStaffSchema,
} from "@acme/db/schema";
import Button from "@acme/ui/common/button";
import FormInput from "@acme/ui/controlled-inputs/form-input";
import { Form, useForm } from "@acme/ui/form";
import { toast } from "@acme/ui/toast";

import { saveService } from "~/data-access/service.dta";

export default function CreateStaff() {
  const form = useForm({
    schema: CreateBillableServiceSchema,
    defaultValues: {},
  });
  async function _create() {
    // await getStudentList();
    const resp = await saveService(form.getValues());
    toast.success("Saved");
    form.reset();
    // await revalidatePath('')
  }
  return (
    <div className="p-4">
      <div className="">Create Staff</div>
      <Form {...form}>
        <FormInput control={form.control} name="title" label="Title" />
        <FormInput control={form.control} name="amount" label="Service Cost" />
        <div className="mt-4 flex justify-end">
          <Button
            action={_create}
            icon="add"
            variant={"outline"}
            className=""
            size={"sm"}
            text={"Create"}
          />
        </div>
      </Form>
    </div>
  );
}
