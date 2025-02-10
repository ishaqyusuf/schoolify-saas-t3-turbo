"use client";

import { useTransition } from "react";

import { Button } from "@acme/ui/button";
import { toast } from "@acme/ui/toast";

import useDataTransform from "../exam-result/use-data-transform";
import { bootstrapSchool } from "./bootstrap";

export default function CreateSchoolPage() {
  //   const domain = await addDomainToVercel(
  //     `${"daarulhadith"}.${env.SERVER_APP_ROOT_DOMAIN}`,
  //   );

  const [loading, startTransition] = useTransition();
  const d = useDataTransform();
  async function createSchool() {
    //
    startTransition(async () => {
      const resp = await bootstrapSchool(d.data);
      console.log(resp);
      toast.error("SUCESS");
    });
  }
  return (
    <>
      <div>
        <Button disabled={loading} onClick={createSchool}>
          Create School
        </Button>

        {/* <div className="px-4">
          {d.data?.map((d) => (
            <div>
              {d.results.map((r) => (
                <div className="flex gap-2">
                  <div>{r.surname}</div>
                  <div>{r.firstName}</div>
                </div>
              ))}
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
}
