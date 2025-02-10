"use client";

import { useEffect, useState } from "react";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";

import { cn } from "@acme/ui";
import { Checkbox } from "@acme/ui/checkbox";
import { Label } from "@acme/ui/label";
import { Slider } from "@acme/ui/slider";
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
import {
  composeStudent,
  quranClasses,
} from "~/lib/third-term/compose-students";
import {
  classByCodes,
  SubjectCodes,
  subjectCodes,
} from "~/lib/third-term/constants";
import { enToAr } from "../../exam-result-2/helper";

export default function Page() {
  const ctx = useContext();
  return (
    <div className="grid grid-cols-5">
      <Filter ctx={ctx} />
      <div
        className={cn(arabic.className, "col-span-4 print:col-span-5")}
        dir="rtl"
      >
        {ctx.classes?.map((cl, i) => (
          <div className="flex flex-col print:break-before-page" key={i}>
            <ExamListHeader qc={cl.qc} fasl={cl.name} />
            <Table dir="rtl" className="student-table w-full">
              <TableHeader>
                <TableRow>
                  {/* <TableHead className="w-10"></TableHead> */}
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="text-right">اسم</TableHead>
                  <TableHead className="w-20" align="center">
                    <div className="flex justify-center">حال</div>
                  </TableHead>
                  {cl.subjects?.map((subject, si) => (
                    <TableHead colSpan={subject.subs?.length || 1} key={si}>
                      <div className="text-center">{subject?.name}</div>
                    </TableHead>
                  ))}
                  <TableHead />
                  <TableHead />
                </TableRow>
                {!cl.subsCount || (
                  <TableRow>
                    <TableHead />
                    <TableHead />
                    <TableHead />
                    {cl.subjects
                      ?.map((s) => (s.subs?.length ? s.subs : [null]))
                      .flat()
                      .map((sub, si) => (
                        <TableHead align="center" key={si}>
                          <div className="text-center">{sub?.title}</div>
                          <div className="text-center">{sub?.mark}</div>
                        </TableHead>
                      ))}
                    <TableHead />
                    <TableHead />
                  </TableRow>
                )}
              </TableHeader>
              {/*
                <TableHead className="w-10"></TableHead>
                <TableHead className="text-right">اسم</TableHead>
                <TableHead></TableHead>
              </TableHeader> */}
              <TableBody>
                {cl.students?.map((student, sid) => (
                  <TableRow key={sid} className="">
                    <TableCell className="w-10">
                      {!student.studentId || (
                        <span>{enToAr(student.studentId)}.</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-base">
                        {[
                          student.firstName,
                          student.middleName,
                          student.lastName,
                        ].join(" ")}
                      </span>
                    </TableCell>
                    <TableCell align="center">{student.examStatus}</TableCell>
                    {cl.subjects?.map((subject, si) => (
                      <TableCell key={si}></TableCell>
                    ))}
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
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
function CheckFilter({ label, ctx, value, list, qk }) {
  const query = ctx.query;
  return (
    <div className="my-0.5 inline-flex items-center gap-2">
      <Checkbox
        onCheckedChange={(e) => {
          let clis = (query?.[qk] || "")?.split(",");
          if (e) clis?.push(value);
          else clis = clis?.filter((a) => a !== value);
          console.log(clis);
          const classes = clis?.filter(Boolean).join(",");
          ctx.setQuery({
            [qk]: classes,
          });
        }}
        checked={query?.[qk]?.split(",").some((s) => s === value)}
      />
      <Label>{label}</Label>
    </div>
  );
}
function Filter({ ctx }: { ctx: ReturnType<typeof useContext> }) {
  const query = ctx.query;
  return (
    <div className="col-span-1 flex flex-col gap-4 print:hidden">
      <div className="">
        <Label>Class</Label>
        {Object.entries(classByCodes).map(([k, v], i) => (
          <div key={i}>
            <Checkbox
              onCheckedChange={(e) => {
                let clis = (query?.classes || "")?.split(",");
                if (e) clis?.push(k);
                else clis = clis?.filter((a) => a != k);
                console.log(clis);
                const classes = clis?.filter(Boolean).join(",");
                ctx.setQuery({
                  classes,
                });
              }}
              checked={query?.classes?.split(",").includes(k)}
            />
            <Label>{v}</Label>
          </div>
        ))}
      </div>
      <div className="">
        <Label>Show</Label>
        {["quran", "default"].map((c) => (
          <div key={c}>
            <Checkbox
              onCheckedChange={(e) => {
                let clis = query?.show || "";
                console.log(clis, e);

                ctx.setQuery({
                  show: e ? c : (undefined as any),
                });
              }}
              checked={query?.show === c}
            />
            <Label>{c}</Label>
          </div>
        ))}
      </div>
      <div>
        {query?.show != "quran" || (
          <div className="flex flex-col">
            {quranClasses.map((c, i) => (
              <CheckFilter
                key={i}
                qk={"qClass"}
                ctx={ctx}
                label={c}
                value={c}
                list={quranClasses}
              />
            ))}
          </div>
        )}
      </div>
      <div className="">
        <Label>Extra Lines</Label>
        <Slider
          max={10}
          min={0}
          value={query?.extraLine ? [query?.extraLine] : undefined}
          onValueChange={(e) => {
            // console.log(e);
            ctx.setQuery({
              extraLine: e[0],
            });
          }}
        />
      </div>
    </div>
  );
}
function useContext() {
  const staticClasses = composeStudent();
  const [classes, setClasses] = useState(staticClasses);
  const [query, setQuery] = useQueryStates(
    {
      show: parseAsStringLiteral(["quran", "default"] as const),
      classes: parseAsString,
      qClass: parseAsString,
      extraLine: parseAsInteger,
    },
    { throttleMs: 500 },
    // {
    //   throttleMs: 50,
    //   // shallow: false,
    //   // history: "push",
    // },
  );
  useEffect(() => {
    let filtered;
    let extraLines = Array(query?.extraLine || 0)
      ?.fill(null)
      .map((s) => ({}));
    if (query.show == "quran") {
      filtered = [];
      let qClassList = query?.qClass?.split(",")?.filter(Boolean);
      staticClasses.map((cls) => {
        cls.students = cls.students.filter((c) => c.quranClass);
        let qClasses = Array.from(
          new Set(cls.students.map((s) => s.quranClass)),
        );
        qClasses.map((q) => {
          let students = cls.students.filter((c) => c.quranClass === q);
          if (
            students.length &&
            (qClassList?.some((s) => s === q) || !qClassList?.length)
          ) {
            filtered.push({
              ...cls,
              subjects: cls.subjects.filter(
                (s) => s.code == ("QUR" as SubjectCodes),
              ),
              // name: cls.name,
              students: [...students, ...extraLines],
              qc: q,
            });
          }
        });
        return cls;
      });
    } else
      filtered = staticClasses
        .map((ls) => {
          if (query.classes) {
            const show = query.classes
              .split(",")
              ?.filter(Boolean)
              .some(
                (a) => !ls.name?.trim().localeCompare(classByCodes[a]?.trim()),
              );

            if (!show) ls.students = [];
            // ls.students =
          }
          if (ls.students.length)
            ls.students = [...ls.students, ...extraLines] as any;
          return ls;
        })
        .filter((a) => a.students.length);
    setClasses(filtered);
  }, [query]);
  return {
    classes,
    query,
    setQuery,
  };
}
