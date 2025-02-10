"use client";

import { useEffect, useState } from "react";
import { parseAsStringEnum, parseAsStringLiteral, useQueryStates } from "nuqs";

import { cn } from "@acme/ui";
import { Label } from "@acme/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";

import ExamListHeader from "~/components/exam-list-header";
import { arabic } from "~/fonts";
import { composeStudent } from "~/lib/third-term/compose-students";
import { classCodes } from "~/lib/third-term/constants";
import { enToAr } from "../../exam-result-2/helper";

export default function Page() {
  // useEffect(() => )
  const [classes, setClasses] = useState([]);
  const [query, setQ] = useQueryStates({
    classes: parseAsStringEnum(classCodes),
  });
  useEffect(() => {
    const res = composeStudent();
    const kv = {};
    res
      .map((s) => s.students)
      .flat()
      .filter((a) => a.quranClass)
      .map((a) => {
        if (!kv[a.quranClass]) kv[a.quranClass] = [];
        kv[a.quranClass].push(a);
      });
    let result = Object.entries(kv).map(([qc, ls]) => {
      return {
        name: qc,
        students: ls,
      };
    });
    setClasses(result);
  }, []);
  // query.
  return (
    <div className="grid grid-cols-5 print:grid-cols-4">
      <div className="print:hidden"></div>
      <div className={cn(arabic.className, "col-span-4")} dir="rtl">
        {classes?.map((cl, i) => (
          <div className="flex flex-col" key={i}>
            <ExamListHeader fasl={cl.name} />
            <Table dir="rtl" className="w-full">
              <TableHeader>
                <TableHead className="w-10"></TableHead>
                <TableHead className="text-right">اسم</TableHead>
                <TableHead></TableHead>
              </TableHeader>
              <TableBody>
                {cl.students?.map((student) => (
                  <TableRow key={student.studentId} className="">
                    <TableCell className="w-10">
                      <span>{enToAr(student.studentId)}.</span>
                    </TableCell>
                    <TableCell>
                      <span>
                        {[
                          student.firstName,
                          student.middleName,
                          student.lastName,
                        ].join(" ")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
}
