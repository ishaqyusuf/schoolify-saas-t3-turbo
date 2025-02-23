import { cn } from "@acme/ui";

import { enToAr } from "~/app/[domain]/exam-result-2/helper";
import { configs } from "~/app/exam-result/data";
import { moonDance } from "~/fonts";

export default function ResultPrintHeader({
  term = "الثالثة",
  fasl,
  data,
  student,
}) {
  return (
    <div className="mb-1">
      <div className="space-y-1s">
        <div className="flex flex-col items-center justify-center">
          <p className="text-xl font-bold text-black/70">
            {configs.schoolName}
          </p>

          <p className={cn(moonDance.className, "text-base text-black")}>
            Sannushehu Street, Isale-koko, Ojagboro, Isale Gambari, Ilorin,
            Kwara State, Nigeria.
          </p>
        </div>
        <div className="space-y-1 font-semibold" dir="rtl">
          {/* <div className="flex gap-4"></div> */}
          <div className="flex flex-wrap gap-4">
            <div className="flex w-2/5">
              <div className="whitespace-nowrap">اسم التلميذ/التلميذة</div>
              <span>:</span>
              <div className="inline-flex w-full border-b-2 border-dashed border-muted-foreground px-4 text-xl">
                {/* {student.pritName?.map((p, i) => (
                  <div className="px-2">{p}</div>
                ))} */}
                <div>{student.fullName}</div>
              </div>
            </div>
            <div className="">
              <span>العام الدراسي</span>
              <span>:</span>
              <span className="mx-2">١٤٤٥/١٤٤٦هـ</span>
            </div>
            <div className="">
              <span>الفصل</span>
              <span>:</span>
              <span className="mx-2 border-b-2 border-dashed border-muted-foreground">
                {fasl}
              </span>
            </div>
            <div className="">
              <span>الفترة</span>
              <span>:</span>
              <span className="mx-2 border-b-2 border-dashed border-muted-foreground">
                {term}
              </span>
            </div>
            <div className="">
              <span>عدد الطلاب في الفصل</span>
              <span>:</span>
              <span className="mx-2 border-b-2 border-dashed border-muted-foreground">
                {enToAr(data.students.length)}
              </span>
            </div>
            <div className="">
              <span>المجموع الكلي </span>
              <span>:</span>
              <span className="mx-2 border-b-2 border-dashed border-muted-foreground">
                {`${enToAr(student.result.totalScores.obtained)}/${enToAr(
                  student.result.totalScores.obtainable,
                )}`}
              </span>
            </div>
            <div className="">
              <span>الدرجة</span>
              <span>:</span>
              <span className="mx-2 border-b-2 border-dashed border-muted-foreground">
                {`${enToAr(student.result.totalScores.position)}`}
              </span>
            </div>
            <div className="">
              <span>تاريخ العودة للعام الجديد</span>
              <span>:</span>
              <span className="mx-2 border-b-2 border-dashed border-muted-foreground">
                {enToAr("05/04/2025")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
