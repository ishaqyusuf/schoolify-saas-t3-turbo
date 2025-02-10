"use client";

import { useEffect } from "react";

import { useFieldArray, useForm } from "@acme/ui";
import Button from "@acme/ui/common/button";
import FormCheckbox from "@acme/ui/controlled-inputs/form-checkbox";
import FormInput from "@acme/ui/controlled-inputs/form-input";
import FormSelect from "@acme/ui/controlled-inputs/form-select";
import { Form } from "@acme/ui/form";
import { SelectItem } from "@acme/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import { toast } from "@acme/ui/toast";

import type { BillableForm } from "~/data-access/billables.dta";
import { createBillables, getBillableForm } from "~/data-access/billables.dta";
import { saveService } from "~/data-access/service.dta";

export default function CreateBillable() {
  const form = useForm<BillableForm>({
    // schema: CreateBillableServiceSchema,
    defaultValues: {},
  });
  const services = useFieldArray({
    control: form.control,
    name: "services",
    keyName: "_id",
  });
  const staffs = useFieldArray({
    control: form.control,
    name: "staffs",
    keyName: "_id",
  });

  useEffect(() => {
    (async () => {
      form.reset(await getBillableForm());
    })();
  }, []);
  async function _create() {
    // await getStudentList();
    const data = form.getValues();
    const s = data.services.find((s) => s.id == data.serviceId);
    const workerIds = [];
    Object.entries(data.selection).map(([k, v]) => v && workerIds.push(k));
    const resp = await createBillables(data.serviceId, s?.amount, workerIds);
    toast.success("Saved");
    // form.reset();
    // await revalidatePath('')
    toast.success("Billables created");
  }
  return (
    <div className="p-4">
      <div className="">Create Staff</div>
      <Form {...form}>
        <FormSelect
          control={form.control}
          name="serviceId"
          label="Service"
          options={services.fields}
          SelectItem={({ option }) => (
            <SelectItem className="" value={option.id}>
              <div className="flex">
                <span>{option.title}</span>
                <div className="flex-1"></div>
                <span>{option.amount}</span>
              </div>
            </SelectItem>
          )}
        />
        <div className="">
          <Table>
            <TableHeader></TableHeader>
            <TableBody>
              {staffs.fields.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <FormCheckbox
                      control={form.control}
                      name={`selection.${s.id}` as any}
                    />
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    <span>{s.title}</span>
                    <span>{s.name}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
