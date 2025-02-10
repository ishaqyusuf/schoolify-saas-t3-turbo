"use client";

import { useEffect } from "react";

import { CreateStudentSchema } from "@acme/db/schema";
import { cn } from "@acme/ui";
import Button from "@acme/ui/common/button";
import FormCheckbox from "@acme/ui/controlled-inputs/form-checkbox";
import FormInput from "@acme/ui/controlled-inputs/form-input";
import FormSelect from "@acme/ui/controlled-inputs/form-select";
import { Form, useForm } from "@acme/ui/form";
import { Label } from "@acme/ui/label";
import { toast } from "@acme/ui/toast";

import { createStudent, createStudentForm } from "~/data-access/students.dta";
import { useClassrooms } from "~/hooks/use-classrooms";
import contants from "~/lib/contants";

export default function CreateBillable() {
  const form = useForm({
    schema: CreateStudentSchema,
    defaultValues: {},
  });
  useEffect(() => {
    createStudentForm().then((r) => {
      form.reset(r);
    });
  }, []);
  const [sessionClassId, schoolFee, uniform] = form.watch([
    "extras.sessionClassId",
    "extras.payments.schoolFee",
    "extras.payments.uniform",
  ]);
  const classRooms = useClassrooms({
    loadOnInit: true,
  });

  async function _create() {
    const t = await form.trigger();
    if (t) {
      //
      try {
        await createStudent(form.getValues() as any);
        toast.success("Created");
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      }
    } else {
      console.log(t);
      console.log(form.formState.errors);
    }

    // await getStudentList();
    // const data = form.getValues();
    // const s = data.services.find((s) => s.id == data.serviceId);
    // let workerIds = [];
    // Object.entries(data.selection).map(([k, v]) => v && workerIds.push(k));
    // const resp = await createBillables(data.serviceId, s?.amount, workerIds);
    // toast.success("Saved");
    // form.reset();
    // await revalidatePath('')
    // toast.success("Billables created");
  }

  return (
    <div className="p-4">
      <div className="">Create Student</div>
      <Form {...form}>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            control={form.control}
            name="firstName"
            className="col-span-2"
            label="First Name"
          />
          <FormInput control={form.control} name="surname" label="Surname" />
          <FormInput
            control={form.control}
            name="otherName"
            label="Other Name"
          />
          <FormSelect
            options={contants.genders}
            // type="combo"
            valueKey="id"
            control={form.control}
            name="gender"
            label="Gender"
          />
          <FormSelect
            options={classRooms.classRooms}
            titleKey="classRoom.name"
            valueKey="id"
            control={form.control}
            name="extras.sessionClassId"
            label="Class"
          />
          <div className="col-span-2 grid gap-4">
            <div className="">
              <Label>Payments</Label>
            </div>
            <FormCheckbox
              control={form.control}
              name="extras.payments.form"
              label="Form"
            />
            <div className="flex items-center justify-between">
              <FormCheckbox
                control={form.control}
                name="extras.payments.schoolFee"
                label="School Fee"
              />
              <div
                className={cn(
                  "w-0 overflow-hidden opacity-0",
                  schoolFee && "w-auto opacity-100",
                )}
              >
                <FormSelect
                  control={form.control}
                  size="sm"
                  placeholder="Amount"
                  options={contants.schoolFees}
                  name="extras.payments.schoolFeeAmount"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <FormCheckbox
                control={form.control}
                name="extras.payments.uniform"
                label="Uniform"
              />
              <div
                className={cn(
                  "w-0 overflow-hidden opacity-0",
                  uniform && "w-auto overflow-auto opacity-100",
                )}
              >
                <FormInput
                  control={form.control}
                  size="sm"
                  placeholder="Amount"
                  type="number"
                  // options={contants.schoolFees}
                  name="extras.payments.uniformAmount"
                />
              </div>
            </div>
          </div>
        </div>
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
