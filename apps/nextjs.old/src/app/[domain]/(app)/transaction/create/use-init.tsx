import { createContext, useContext, useEffect, useState } from "react";

import { useForm, useFormContext } from "@acme/ui";

import { getStudentList, StudentsList } from "~/data-access/students.dta";
import {
  getTransactionForm,
  TransactionForm,
} from "~/data-access/transactions.dta";

export const useTransactionForm = () => useFormContext<TransactionForm>();

export const TransactionFormContext = createContext<
  ReturnType<typeof useInitCtx>
>({} as any);
export const useTxFormCtx = () => useContext(TransactionFormContext);
export function useInitCtx() {
  const form = useForm<TransactionForm>({
    // schema: CreateBillableServiceSchema,
    defaultValues: {},
  });
  const type = form.watch("transactionType");
  const [students, setStudents] = useState<StudentsList>([]);

  useEffect(() => {
    (async () => {
      form.reset(await getTransactionForm());
    })();
  }, []);
  useEffect(() => {
    (async () => {
      switch (type) {
        case "school fee":
          if (!students.length)
            getStudentList().then((res) => setStudents(res));
          break;
      }
    })();
  }, [type]);

  return {
    form,
    type,
    students,
  };
}
