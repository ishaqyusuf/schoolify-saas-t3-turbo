"use client";

import { useEffect, useState } from "react";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Icons } from "@acme/ui/common/icons";
import Portal from "@acme/ui/common/portal";
import { useSidebar } from "@acme/ui/sidebar";

import { QuestionDisplay } from "~/components/question-display";
import { QuestionFilter } from "~/components/question-filter";
import { QuestionFormSheet } from "~/components/sheets/question-form-sheet";
import { useQuestionForm } from "~/hooks/use-question-form";
import { useStoreInit } from "~/hooks/use-store-init";
import { questions } from "~/lib/third-term/questions";
import { dataStore } from "~/lib/third-term/store";

export default function Page() {
  const questionForm = useQuestionForm();
  useStoreInit();
  const store = dataStore();
  const sb = useSidebar();
  return (
    <div className="flex">
      <div className="">
        {sb.open && (
          <Portal nodeId={"sideBarContent"}>
            <QuestionFilter />
          </Portal>
        )}
      </div>
      <div className="flex-1">
        {store.questions?.map((q, i) => <QuestionDisplay key={i} index={i} />)}

        <QuestionFormSheet />
        <div className="fixed bottom-0 right-0 m-4 print:hidden">
          <Button
            onClick={() => {
              questionForm.createQuestion();
            }}
          >
            <Icons.add className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
