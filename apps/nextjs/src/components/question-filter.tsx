"use client";

import { parseAsString, useQueryStates } from "nuqs";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@acme/ui/collapsible";
import { Icons } from "@acme/ui/common/icons";

import { arabic } from "~/fonts";
import { useQuestionQuery } from "~/hooks/use-question-query";
import {
  classByCodes,
  classCodes,
  classSubjectsByCode,
  subjectsByCode,
} from "~/lib/third-term/constants";
import { CheckFilter } from "./check-filter";

export function QuestionFilter({}) {
  const ctx = useQuestionQuery();
  return (
    <div className={cn("sm:w-[156px] print:hidden", arabic.style)} dir="rtl">
      {classCodes.map((cc) => (
        <div key={cc}>
          <Section label={classByCodes[cc]}>
            {" "}
            {classSubjectsByCode[cc].map((cs) => (
              <div key={cs}>
                <CheckFilter
                  ctx={ctx}
                  qk={`questions`}
                  label={`${subjectsByCode[cs]}`}
                  value={`${cc}-${cs}`}
                />
              </div>
            ))}
          </Section>
        </div>
      ))}
    </div>
  );
}
function Section({ children, label }) {
  return (
    <Collapsible className="w-[350px]s space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">{label}</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <Icons.arrowDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      {/* <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
        @radix-ui/primitives
      </div> */}
      <CollapsibleContent className="space-y-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}
