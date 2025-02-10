"use client";

import { revalidatePath } from "next/cache";

import { CreateStaffSchema } from "@acme/db/schema";
import Button from "@acme/ui/common/button";
import FormInput from "@acme/ui/controlled-inputs/form-input";
import { Form, useForm } from "@acme/ui/form";
import { toast } from "@acme/ui/toast";

import { saveStaff } from "~/data-access/staffs.dta";

export default function CreateStaff() {
  const form = useForm({
    schema: CreateStaffSchema,
    defaultValues: {},
  });
  async function createStaff() {
    // await getStudentList();
    const resp = await saveStaff(form.getValues());
    toast.success("Saved");
    form.reset();
    // await revalidatePath('')
  }
  return (
    <div className="p-4">
      <div className="">Create Staff</div>
      <Form {...form}>
        <FormInput control={form.control} name="title" label="Title" />
        <FormInput control={form.control} name="name" label="Staff Name" />
        <FormInput control={form.control} name="email" label="Email" />
        <FormInput control={form.control} name="username" label="Username" />
        <FormInput control={form.control} name="phoneNo" label="Phone No" />
        <div className="mt-4 flex justify-end">
          <Button
            action={createStaff}
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
