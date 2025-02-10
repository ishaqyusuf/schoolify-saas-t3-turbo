"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { TransactionType } from "@acme/db/schema";
import { transactionTypes } from "@acme/db/schema";
import { useForm, useFormContext } from "@acme/ui";
import { Badge } from "@acme/ui/badge";
import Button from "@acme/ui/common/button";
import ControlledSelect from "@acme/ui/controlled-inputs/controlled-select";
import FormCheckbox from "@acme/ui/controlled-inputs/form-checkbox";
import FormSelect from "@acme/ui/controlled-inputs/form-select";
import { Form } from "@acme/ui/form";
import { ScrollArea } from "@acme/ui/scroll-area";
import { SelectItem } from "@acme/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";
import { toast } from "@acme/ui/toast";

import { getStudentList, StudentsList } from "~/data-access/students.dta";
import {
  getTransactionForm,
  TransactionForm,
} from "~/data-access/transactions.dta";
import contants from "~/lib/contants";
import { TransactionFormContext, useInitCtx, useTxFormCtx } from "./use-init";

export default function CreateTransactionForm() {
  const bctx = useInitCtx();
  const { form, type } = bctx;
  async function _create() {
    // await getStudentList();
    const data = form.getValues();
    // const s = data.services.find((s) => s.id == data.serviceId);
    // let workerIds = [];
    // Object.entries(data.selection).map(([k, v]) => v && workerIds.push(k));
    // const resp = await createBillables(data.serviceId, s?.amount, workerIds);
    toast.success("Saved");
    // form.reset();
    // await revalidatePath('')
    toast.success("Billables created");
  }
  function Content({ children, value }: { children?; value: TransactionType }) {
    return <TabsContent value={value}>{children}</TabsContent>;
  }
  return (
    <TransactionFormContext.Provider value={bctx}>
      <div className="p-4">
        <div className="">Create Staff</div>
        <Form {...form}>
          <FormSelect
            control={form.control}
            name="transactionType"
            label="Transaction Type"
            options={transactionTypes as any}
            // SelectItem={({ option }) => (
            //   <SelectItem className="" value={option.id}>
            //     <div className="flex">
            //       <span>{option.title}</span>
            //       <div className="flex-1"></div>
            //       <span>{option.amount}</span>
            //     </div>
            //   </SelectItem>
            // )}
          />
          <div className="">
            <Table>
              <TableHeader></TableHeader>
              <TableBody>
                {/* {staffs.fields.map((s) => (
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
              ))} */}
              </TableBody>
            </Table>
          </div>

          <Tabs
            value={type as any}
            onChange={(e) => {
              console.log(e);
            }}
          >
            {/* <TabsList>
            {transactionTypes.map((type) => (
              <TabsTrigger asChild value={type} key={type}></TabsTrigger>
            ))}
          </TabsList> */}
            <Content value="entry form"></Content>
            <Content value="inventory"></Content>
            <Content value="misc"></Content>
            <Content value="salary"></Content>
            <Content value="school fee">
              <SchoolFee />
            </Content>
            <Content value="service payment"></Content>
            <Content value="uniform"></Content>
          </Tabs>
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
    </TransactionFormContext.Provider>
  );
}
function SchoolFee() {
  const { form, students, ...ctx } = useTxFormCtx();

  return (
    <div>
      <span>School Fee</span>

      <ScrollArea className="mx-2 h-[50vh]">
        <Table>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <p>{student.fullName}</p>

                  <Badge
                    variant={student.currentTerm ? "default" : "secondary"}
                  >
                    {student.classRoom}
                  </Badge>
                </TableCell>
                <TableCell>
                  <FormSelect
                    type="combo"
                    control={form.control}
                    name={`selection.${student.id}`}
                    options={contants.schoolFees}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="grid grid-cols-2 gap-2"></div>
    </div>
  );
}
