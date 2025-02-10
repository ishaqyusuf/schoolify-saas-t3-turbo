"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { cva } from "class-variance-authority";
import { parseAsInteger, useQueryState, useQueryStates } from "nuqs";

import { cn } from "@acme/ui";
import { Label } from "@acme/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@acme/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";

import type { ClassData } from "./helper";
import { configs } from "~/app/exam-result/data";
import { arabic, moonDance } from "~/fonts";
import { compose, enToAr } from "./helper";
import { examStore } from "./store";

function col(title, value, cols) {
  return { title, value, cols };
}
interface RenProps {
  result?: ClassData["students"][number];
  fasl?: ClassData;
}
const header = [
  col("العام الدراسي", "1445/1446هـ", 4),
  col(
    "اسم التلميذ/التلميذة",
    ({ result }: RenProps) => (
      <div className="flex flex-row-reverse space-x-4 text-xl">
        {result?.displayName?.map((n, i) => (
          <span className="ml-5" key={i}>
            {n}
          </span>
        ))}
      </div>
    ),
    8,
  ),
  col("الدرجة", ({ result }: RenProps) => enToAr(result?.positionAr), 2),
  col(
    "عدد الطلاب في الفصل",
    ({ result, fasl }: RenProps) => <span>{enToAr(fasl?.totalStudents)}</span>,
    3,
  ),
  col(
    "المجموع الكلي",
    ({ result }: RenProps) => <span>{enToAr(result?.totalScoreAr)}</span>,
    2,
  ),
  col("الفترة", "الثانية", 2),
  col("الفصل", ({ result, fasl }: RenProps) => fasl?.class, 3),
];
function FilterOption({ name, label }) {
  const store = examStore();
  const searchParams = useSearchParams();
  // const [q, setQ] = useQueryState(name, {
  //   throttleMs: 300,
  // });
  const router = useRouter();
  const initialValue = decodeURIComponent(searchParams.get(name) || "");
  const [q, setQ] = useState(initialValue);
  useEffect(() => {
    store.setQuery(name, q);
    store.filterData();
    const params = new URLSearchParams(searchParams);
    if (q) {
      params.set(name, q);
    } else {
      params.delete(name);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [q]);
  if (name == "name")
    return (
      <div className="grid gap-2">
        <Label>{label}</Label>
      </div>
    );
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select
        onValueChange={(e) => {
          setQ(e);
        }}
      >
        <SelectTrigger className="h-8">{q}</SelectTrigger>
        <SelectContent>
          {store.searchOptions?.[name]
            ?.map((s) => ({
              label: typeof s == "string" ? s : s.label,
              value: typeof s == "string" ? s : s.value,
            }))
            .map((s, i) => (
              <SelectItem key={i} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
const gridVariants = cva("", {
  variants: {
    grid: {
      2: "col-span-2",
      8: "col-span-8",
      9: "col-span-9",
      4: "col-span-4",
      3: "col-span-3",
    },
  },
});
// 8.3 x 11.7
const pageSizeVariant = cva("", {
  variants: {
    size: {
      half: "h-[5.85in] space-y-2 pt-8",
      half2: "h-[5.85in] space-y-2 pt-8",
      half3: "h-[5.85in] space-y-2 pt-8",
      full: "h-[11.6in] space-y-8 pt-10",
    },
  },
});
export default function ExamResultPage({ searchParams }) {
  const store = examStore();

  useEffect(() => {
    console.log(compose(store));
  }, []);
  const pageSize = store.searchParams.pageSize as any;
  return (
    <div className="flex flex-col p-4">
      <div className="">
        <div className="flex gap-4 print:hidden">
          <FilterOption label={"Class Filter"} name={"class-q"} />
          <FilterOption label={"Result Filter"} name={"result-q"} />
          <FilterOption label={"Sort"} name={"sort"} />
          <FilterOption label={"Page Size"} name={"pageSize"} />
          <FilterOption label={"Result"} name={"result"} />
        </div>
      </div>
      <div className={cn(arabic.className)}>
        {store.filteredData?.map((classRoom, index) => {
          const isFull = store.searchParams.pageSize == "full";
          const isHalf2 = store.searchParams.pageSize == "half2";
          const isHalf3 = store.searchParams.pageSize == "half3";
          const baseIndex = store.filteredData
            .filter((a, _) => _ < index)
            .map((a) => a.students.length)
            .reduce((a, b) => a + b, 0);
          return (
            <div key={index}>
              {store.searchParams?.["result-q"] == "list" ? (
                <>
                  <div className="flex justify-end bg-muted-foreground/20 p-2 text-xl font-bold">
                    {classRoom.class}
                  </div>
                  <Table dir="rtl">
                    <TableHeader>
                      <TableRow>
                        <TableHead></TableHead>
                        <TableHead className="rtl:align-middle">اسم</TableHead>
                        {classRoom?.subjects?.map((s) => (
                          <TableHead align="center">{s.title}</TableHead>
                        ))}
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classRoom.students.map((student, index) => (
                        <TableRow>
                          <TableCell>{student.positionAr}</TableCell>
                          <TableCell>
                            <Label className="text-lg font-bold">
                              {student.fullName}
                            </Label>
                          </TableCell>
                          {student.scores.map((s, i) => (
                            <TableCell align="center" key={i}>
                              {s.total ? s.totalAr : ""}
                            </TableCell>
                          ))}
                          <TableCell>{student.totalScoreAr}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <>
                  {classRoom.students?.map((r, ri) => (
                    <div
                      className={cn(
                        "border-t border-dashed border-muted-foreground",
                        (isFull || (ri + baseIndex) % 2 != 1) &&
                          "print:border-none",
                        (ri + baseIndex) % 2 == 1 ? "sbg-blue-50" : "",
                        arabic.className,
                        pageSizeVariant({
                          size: pageSize,
                        }),
                      )}
                      key={ri}
                    >
                      <div className="space-y-2">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-3xl font-bold text-black/70">
                            {configs.schoolName}
                          </p>

                          <p
                            className={cn(
                              moonDance.className,
                              "text-lg text-black",
                            )}
                          >
                            Sannushehu Street, Isale-koko, Ojagboro, Isale
                            Gambari, Ilorin, Kwara State, Nigeria.
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="w-full border-b-4 border-muted-foreground"></div>
                          <div className="under-line w-full"></div>
                        </div>
                      </div>
                      <div className="print-px grid grid-cols-12 gap-4">
                        {header.map((h, i) => (
                          <div
                            key={i}
                            className={cn(
                              "flex items-end justify-end space-x-1",
                              gridVariants({
                                grid: h.cols,
                              }),
                            )}
                          >
                            <div className="under-line mx-1 flex flex-1 justify-end whitespace-nowrap px-2 font-bold text-black/70">
                              {typeof h.value == "string" ? (
                                h.value
                              ) : (
                                <h.value result={r} fasl={classRoom} />
                              )}
                            </div>
                            <div className="">:</div>
                            <div className="whitespace-nowrap text-sm">
                              {h.title}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="print-px">
                        <table
                          id="resultTable"
                          className={cn("w-full", pageSize)}
                        >
                          <thead>
                            <th align="center" className="">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="text-xs font-semibold">
                                  ({enToAr(100)})
                                </div>
                                <div>{configs.total}</div>
                              </div>
                            </th>
                            <th align="center" className="">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="text-xs font-semibold">
                                  ({enToAr(70)})
                                </div>
                                <div>{configs.exam}</div>
                              </div>
                            </th>
                            <th align="center" className="">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="text-xs font-semibold">
                                  ({enToAr(20)})
                                </div>
                                <div>{configs.test}</div>
                              </div>
                            </th>
                            <th align="center" className="">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="text-xs font-semibold">
                                  ({enToAr(10)})
                                </div>
                                <div>{configs.attendance}</div>
                              </div>
                            </th>
                            <th align="right">المواد</th>
                            <th align={"center"}>الرقم</th>
                          </thead>
                          <tbody>
                            {r.scores
                              ?.filter((s) => !s.scheme?.length)
                              .map((s, si) => (
                                <tr className="" key={si}>
                                  <td align="center">{s.totalAr}</td>
                                  <td align="center">{s.totalAr}</td>
                                  <td align="center">-</td>
                                  <td align="center">-</td>
                                  <td align="right">{s.title}</td>
                                  <td align="center">{enToAr(si + 1)}</td>
                                </tr>
                              ))}
                            {r.scores
                              ?.filter((s) => s.scheme?.length > 1)
                              ?.map((s, si) => (
                                <Fragment key={si}>
                                  <tr>
                                    {s.scheme.map((q, i) => {
                                      if (i == 0)
                                        return (
                                          <td align="center" rowSpan={2}>
                                            {q.scoreAr}
                                          </td>
                                        );

                                      return (
                                        <th
                                          rowSpan={i == 0 ? 2 : 1}
                                          key={i}
                                          align="center"
                                        >
                                          {/* <div> */}
                                          {/* {i > 0 &&
                                              `(${enToAr(
                                                i == 1 ? 50 : i == 2 ? 30 : 20,
                                              )})`}{" "} */}
                                          {i == 0 ? q.scoreAr : q.title}
                                          {/* </div> */}
                                        </th>
                                      );
                                    })}
                                    <td rowSpan={2} align="right">
                                      {configs.quran}
                                    </td>
                                    <td rowSpan={2} align="center">
                                      {enToAr(r.scores.length)}
                                    </td>
                                  </tr>
                                  <tr>
                                    {s.scheme?.map((q, i) =>
                                      i == 0 ? null : (
                                        <td align="center">
                                          {/* <div> */}
                                          {q.scoreAr}
                                          {/* </div> */}
                                        </td>
                                      ),
                                    )}
                                  </tr>
                                </Fragment>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="print-px">
                        {Array(isHalf3 ? 2 : 3)
                          .fill(null)
                          .map((_, i) => (
                            <div
                              key={i}
                              className="flex justify-end border-b border-dashed border-black/50"
                            >
                              {
                                <span
                                  className={cn(
                                    i != 0
                                      ? "text-transparent"
                                      : "text-black/70",
                                    "font-semibold",
                                    isFull
                                      ? "leading-loose"
                                      : isHalf2
                                        ? ""
                                        : "leading-relaxed",
                                    "",
                                  )}
                                >
                                  {configs.comment}
                                </span>
                              }
                            </div>
                          ))}
                      </div>
                      <div className={cn("print-px flex justify-between pt-8")}>
                        {[
                          configs.directorSignature,
                          configs.teacherSignature,
                        ].map((c, ci) => (
                          <div className="relative">
                            {ci == 0 && (
                              <div className="absolute -top-8 right-2">
                                <Image
                                  width={80}
                                  height={80}
                                  src={`/signature.png`}
                                  className="object-fill"
                                  loading="lazy"
                                />
                              </div>
                            )}
                            <div
                              className="flex w-[120px] justify-center border-t border-dashed border-black/50"
                              key={ci}
                            >
                              {c}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
