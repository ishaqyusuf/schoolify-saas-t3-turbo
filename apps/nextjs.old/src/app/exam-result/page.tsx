"use client";

import Image from "next/image";
import { cva } from "class-variance-authority";

import { cn } from "@acme/ui";

import { arabic, moonDance } from "~/fonts";
import { configs } from "./data";
import useDataTransform from "./use-data-transform";

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
      full: "h-[11.6in] space-y-8 pt-10",
    },
  },
});
export default function ExamResult() {
  const tran = useDataTransform();

  return (
    <div>
      <div className="flex p-2 print:hidden">
        <select
          onChange={(e) => {
            tran.setShowClass(e.target.value);
          }}
          defaultValue={tran.showClass}
        >
          <option value={"All"}>All</option>
          {tran.data.map((d, i) => (
            <option value={d.className} key={i}>
              {d.className}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => {
            tran.setSortBy(e.target.value);
          }}
          defaultValue={tran.showClass}
        >
          <option value={"grade"}>Grade</option>
          <option value={"name"}>Name</option>
          <option value={"none"}>No Sort</option>
        </select>
        <input
          className="flex-1 border p-1"
          value={tran.showInput}
          onChange={(e) => tran.setShowInput(e.target.value)}
        />
        <input
          className="flex-1 border p-1"
          value={tran.showNames}
          onChange={(e) => tran.setShowNames(e.target.value)}
        />
      </div>
      {tran.filtered().map((data, i) => {
        const isFull = data.pageSize == "full";
        const isHalf2 = data.pageSize == "half2";
        const baseIndex = tran
          .filtered()
          .filter((a, _) => _ < i)
          .map((a) => a.results.length)
          .reduce((a, b) => a + b, 0);
        return (
          <div key={i}>
            {data.results.map((r, ri) => {
              return (
                <div
                  className={cn(
                    "border-t border-dashed border-muted-foreground",
                    (isFull || (ri + baseIndex) % 2 != 1) &&
                      "print:border-none",
                    (ri + baseIndex) % 2 == 1 ? "sbg-blue-50" : "",
                    arabic.className,
                    pageSizeVariant({
                      size: data.pageSize,
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
                        Sannushehu Street, Isale-koko, Ojagboro, Isale Gambari,
                        Ilorin, Kwara State, Nigeria.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full border-b-4 border-muted-foreground"></div>
                      <div className="under-line w-full"></div>
                    </div>
                  </div>
                  <div className="print-px grid grid-cols-12 gap-4">
                    {tran.header.map((h, i) => (
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
                            <h.value result={r} fasl={data} />
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
                      className={cn("w-full", data.pageSize)}
                    >
                      <thead>
                        <th align="center" className="">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="text-xs font-semibold">
                              ({tran.enToAr(100)})
                            </div>
                            <div>{configs.total}</div>
                          </div>
                        </th>
                        <th align="center" className="">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="text-xs font-semibold">
                              ({tran.enToAr(70)})
                            </div>
                            <div>{configs.exam}</div>
                          </div>
                        </th>
                        <th align="center" className="">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="text-xs font-semibold">
                              ({tran.enToAr(20)})
                            </div>
                            <div>{configs.test}</div>
                          </div>
                        </th>
                        <th align="center" className="">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="text-xs font-semibold">
                              ({tran.enToAr(10)})
                            </div>
                            <div>{configs.attendance}</div>
                          </div>
                        </th>
                        <th align="right">المواد</th>
                        <th align={"center"}>الرقم</th>
                      </thead>
                      <tbody>
                        {r.Subjects.map((s, si) => (
                          <tr className="" key={si}>
                            <td align="center">{tran.enToAr(s.score)}</td>
                            <td align="center">{tran.enToAr(s.score)}</td>
                            <td align="center">-</td>
                            <td align="center">-</td>
                            <td align="right">{s.name}</td>
                            <td align="center">{tran.enToAr(si + 1)}</td>
                          </tr>
                          // <td key={`res-${ri}-subject-${si}`}>{s.score}</td>
                        ))}
                        {r.quran && (
                          <>
                            <tr>
                              {r.quran.map((q, i) => {
                                if (i == 0)
                                  return (
                                    <td align="center" rowSpan={2}>
                                      {tran.enToAr(q.mark)}
                                    </td>
                                  );
                                return (
                                  <th
                                    rowSpan={i == 0 ? 2 : 1}
                                    key={i}
                                    align="center"
                                  >
                                    <div>
                                      {i > 0 &&
                                        `(${tran.enToAr(
                                          i == 1 ? 50 : i == 2 ? 30 : 20,
                                        )})`}{" "}
                                      {i == 0 ? tran.enToAr(q.mark) : q.title}
                                    </div>
                                  </th>
                                );
                              })}
                              <td rowSpan={2} align="right">
                                {configs.quran}
                              </td>
                              <td rowSpan={2} align="center">
                                {tran.enToAr(r.Subjects.length + 1)}
                              </td>
                            </tr>
                            <tr>
                              {r.quran.map((q, i) =>
                                i == 0 ? null : (
                                  <td key={i} align="center">
                                    <div>{tran.enToAr(q.mark)}</div>
                                  </td>
                                ),
                              )}
                              {/* <td align="right"></td> */}
                              {/* <td align="center"></td> */}
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="print-px">
                    {Array(3)
                      .fill(null)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="flex justify-end border-b border-dashed border-black/50"
                        >
                          {
                            <span
                              className={cn(
                                i != 0 ? "text-transparent" : "text-black/70",
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
                    {[configs.directorSignature, configs.teacherSignature].map(
                      (c, ci) => (
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
                      ),
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      <div className="print:hidden">
        {tran.filtered().map((data, i) => (
          <div key={i}>
            <table className="w-full">
              <thead>
                <tr>
                  <th>
                    <div>Class: {data.className}</div>
                  </th>
                  <th>
                    <div>Total students: {data.totalstudents}</div>
                  </th>
                </tr>
              </thead>
            </table>
            <table className="w-full">
              <thead>
                <tr>
                  <td>Position</td>
                  <td>Total</td>
                  {data.Subjects.reverse().map((s, i) => (
                    <th key={i}>{s}</th>
                  ))}
                  <td>Names</td>
                  <td>Sn.</td>
                </tr>
              </thead>
              <tbody>
                {data.results.map((r, ri) => (
                  <tr key={ri}>
                    <td>{r.position}</td>
                    <td>{r.totalObtained}</td>
                    {r.Subjects.map((s, si) => (
                      <td key={`res-${ri}-subject-${si}`}>{s.score}</td>
                    ))}
                    <td>{r.studentName}</td>
                    <td>.{ri + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
