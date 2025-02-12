import { cn } from "@acme/ui";

import { configs } from "~/app/exam-result/data";
import { moonDance } from "~/fonts";

export default function ExamPaperHeader({ subject, term = "الثالثة", fasl }) {
  return (
    <div className="mb-3">
      <div className="space-y-2">
        <div className="flex flex-col items-center justify-center">
          <p className="text-xl font-bold text-black/70">
            {configs.schoolName}
          </p>

          <p className={cn(moonDance.className, "text-base text-black")}>
            Sannushehu Street, Isale-koko, Ojagboro, Isale Gambari, Ilorin,
            Kwara State, Nigeria.
          </p>
        </div>
        <div className="space-y-3 font-semibold" dir="rtl">
          <div className="flex gap-4">
            <div className="flex w-2/3">
              <div className="whitespace-nowrap">اسم التلميذ/التلميذة</div>
              <span>:</span>
              <div className="w-full border-b-2 border-dashed border-muted-foreground"></div>
            </div>
            <div className="">
              <span>العام الدراسي</span>
              <span>:</span>
              <span className="mx-2">١٤٤٥/١٤٤٦هـ</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <span>الفصل</span>
              <span>:</span>
              <span className="mx-2">{fasl}</span>
            </div>
            <div className="flex-1">
              <span>الفترة</span>
              <span>:</span>
              <span className="mx-2">{term}</span>
            </div>
            <div className="flex-1">
              <span>المادة</span>
              <span>:</span>
              <span className="mx-2">{subject}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
