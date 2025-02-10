"use client";

import { useState } from "react";

import { cn } from "@acme/ui";

import ExamPaperHeader from "~/components/exam-paper-header";
import { arabic, moonDance } from "~/fonts";
import { questions } from "~/lib/third-term/questions";

export default function Page() {
  const [classQuestions, setQuetionList] = useState(questions);

  return (
    <div className={cn(arabic.className)}>
      {classQuestions?.map((c, i) => {
        return (
          <div className={cn("")} dir="rtl" key={i}>
            <div className="">
              {c.questions?.map((q, i) => (
                <div key={i}>
                  <ExamPaperHeader fasl={c.class} subject={q.subject} />
                  <div className="flex flex-col">
                    {q.questionLines?.map((line, i) => (
                      <div
                        className={cn(
                          "inline-flex flex-wrap",
                          "",
                          line.qNo
                            ? "mr-4 leading-8"
                            : line.type == "sub-question"
                              ? "mr-8 leading-10"
                              : "my-1 mt-2 leading-10",
                        )}
                        key={i}
                      >
                        {!line.qNo || <div className="w-7">{line.qNo}.</div>}
                        <span>{line.text}</span>
                        {!line?.options?.length || (
                          <div className="mr-4 inline-flex space-x-4">
                            {line?.options?.map((opt, a) => (
                              <div
                                key={a}
                                className="flex items-center space-x-4"
                              >
                                <div className="ml-2 inline-flex size-5 items-center justify-center rounded-full border border-muted-foreground text-sm">
                                  {opt.label}
                                </div>
                                <div>{opt.text}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
