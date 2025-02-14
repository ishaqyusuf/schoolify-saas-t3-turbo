import { cva } from "class-variance-authority";

import { cn, FormProvider, useForm } from "@acme/ui";
import { Button } from "@acme/ui/button";
import FormSelect from "@acme/ui/controlled-inputs/form-select";

import { arabic } from "~/fonts";
import { useQuestionForm } from "~/hooks/use-question-form";
import { useQuestionQuery } from "~/hooks/use-question-query";
import { classByCodes, subjectsByCode } from "~/lib/third-term/constants";
import { buildQuestion } from "~/lib/third-term/question-builder";
import { dataStore } from "~/lib/third-term/store";
import ExamPaperHeader from "./exam-paper-header";

const pageVariant = cva("", {
  variants: {
    page: {
      half: "h-[5.85in]",
      half2: "h-[5.85in]",
      //   half2: "h-[5.85in] space-y-2 pt-8",
      //   half3: "h-[5.85in] space-y-2 pt-8",
      full: "h-[11.6in]",
    },
  },
});
const questionStyle = cva("", {
  variants: {
    t: {
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
    },
    mt: {
      "1": "mt-1",
      "2": "mt-2",
      "4": "mt-4",
      "6": "mt-6",
      "8": "mt-8",
      "10": "mt-10",
      "12": "mt-12",
    },
    bb: {
      "1": "border-b-2 border-dashed border-muted-foreground/60",
    },
    h: {
      "8": "h-8",
      "12": "h-12",
      "16": "h-16",
      "20": "h-20",
      "24": "h-24",
    },
  },
});
export function QuestionDisplay({ index }) {
  const store = dataStore();
  const question = store.questions?.[index];
  const questLines = buildQuestion(question?.data.raw);
  const qForm = useQuestionForm();
  const form = useForm({
    defaultValues: {
      page: "half" as "half" | "full" | "half2",
      qty: "1",
    },
  });
  const formData = form.watch();
  const vars = { page: formData.page };
  const qFilter = useQuestionQuery();
  const key = `${question?.data.classCode}-${question?.data.subjectCode}`;
  const show =
    !qFilter?.query?.questions || qFilter?.query?.questions?.includes(key);

  return (
    <div
      dir={"rtl"}
      className={cn(
        arabic.className,
        "space-y-2s relative w-[8.27in]",

        !show && "hidden",
      )}
    >
      <FormProvider {...form}>
        <div className="absolute top-0 flex print:hidden">
          <Button
            onClick={() => {
              qForm.editQuestion(question?.id);
            }}
          >
            Edit
          </Button>
          <FormSelect
            control={form.control}
            name="page"
            options={["half", "full", "half2"]}
          />
          <FormSelect control={form.control} name="qty" options={["1", "2"]} />
        </div>
      </FormProvider>

      {Array(Number(formData?.qty))
        ?.fill(null)
        .map((a, i) => (
          <div
            className={cn(
              pageVariant({
                ...vars,
              }),
              i == 1 && "border-t-2 border-dashed border-muted-foreground pt-8",
            )}
            key={i}
          >
            <ExamPaperHeader
              fasl={classByCodes[question?.data?.classCode!!]}
              subject={subjectsByCode[question?.data?.subjectCode!!]}
            />
            {questLines?.map((ln, i) => (
              <div
                className={cn(
                  ln.qNo && "mt-2",
                  "my-2",
                  questionStyle(ln?.styles),
                )}
              >
                {/* {!ln.options?.length || ( */}
                <div
                  className={cn(
                    "w-fulls inline-flex flex-1 flex-wrap space-x-4",
                    ln.type == "instruction" && "w-full flex-1 justify-center",
                    ln.grids?.length && "hidden",
                  )}
                >
                  {!ln.qNo || <span className="mx-2">{ln.qNo}.</span>}
                  <div className="flex-1 text-center">{ln.text}</div>
                  {ln.options?.map((o, oi) => (
                    <div key={oi} className="flex items-center space-x-4">
                      <div className="ml-2 inline-flex size-5 items-center justify-center rounded-full border border-muted-foreground text-sm">
                        {o.index}
                      </div>
                      <div className="">{o.text}</div>
                    </div>
                  ))}
                </div>
                {/* )} */}
                {!ln?.grids?.length || (
                  <div
                    className={cn(
                      "mr-6 grid gap-2",
                      ln.grids.length == 2 && "grid-cols-2",
                      ln.grids.length == 3 && "grid-cols-3",
                      ln.grids.length == 4 && "grid-cols-4",
                    )}
                  >
                    {ln.grids?.map((g, i) => (
                      <div key={i}>
                        {g.index && (
                          <span className="borders ml-2 inline-flex size-5 items-center justify-center rounded-full border-muted-foreground text-sm">
                            {g.index}
                            {")"}
                          </span>
                        )}
                        <span>{g.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
