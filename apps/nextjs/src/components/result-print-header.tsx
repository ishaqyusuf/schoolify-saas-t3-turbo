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
    <div className="mb-3s">
      <div className="space-y-2">
        <div className="flex flex-col items-center justify-center">
          <p className="text-xl font-bold leading-none text-black/70">
            {configs.schoolName}
          </p>

          <p className={cn(moonDance.className, "text-base text-black")}>
            Sannushehu Street, Isale-koko, Ojagboro, Isale Gambari, Ilorin,
            Kwara State, Nigeria.
          </p>
        </div>
        <div className="space-y-1">
          <div className="w-full border-b-4 border-muted-foreground"></div>
          <div className="under-line w-full"></div>
        </div>
        <div className="space-y-2 text-sm font-semibold" dir="rtl">
          <div className="flex gap-2">
            <div className="flex w-2/3 items-end">
              <div className="whitespace-nowrap">اسم التلميذ/التلميذة</div>
              <span>:</span>
              <div className="inline-flex w-full border-b-2 border-dashed border-muted-foreground px-4 text-xl">
                {/* {student.fullName} */}
                {student.pritName?.map((p, i) => (
                  <div className="px-2">{p}</div>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <span>العام الدراسي</span>
              <span>:</span>
              <span className="mx-2">١٤٤٥/١٤٤٦هـ</span>
            </div>
          </div>
          <div className="flex-wraps flex items-end gap-2 whitespace-nowrap text-sm">
            <div className="flex items-end">
              <span>الفصل</span>
              <span>:</span>
              <span className="mx-2 border-b border-muted-foreground">
                {fasl}
              </span>
            </div>
            <div className="flex items-end">
              <span>الفترة</span>
              <span>:</span>
              <span className="mx-2 border-b border-muted-foreground">
                {term}
              </span>
            </div>
            <div className="">
              <span>عدد الطلاب في الفصل</span>
              <span>:</span>
              <span className="mx-2 border-b border-muted-foreground">
                {enToAr(data.students.length)}
              </span>
            </div>
            <div className="">
              <span>المجموع الكلي </span>
              <span>:</span>
              <span className="mx-2 border-b border-muted-foreground">
                {`${enToAr(student.result.totalScores.obtained)}/${enToAr(
                  student.result.totalScores.obtainable,
                )}`}
              </span>
            </div>
            <div className="">
              <span>الدرجة</span>
              <span>:</span>
              <span className="mx-2 border-b border-muted-foreground">
                {`${enToAr(student.result.totalScores.position)}`}
              </span>
            </div>
            <div className="">
              <span>تاريخ العودة للعام الجديد</span>
              <span>:</span>
              <span className="mx-2 border-b border-muted-foreground">
                {enToAr("05/04/2025")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
