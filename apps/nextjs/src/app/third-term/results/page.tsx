"use client";

import {
  dumpStudentData,
  truncateData,
} from "actions/dumb-student-data-action";

import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { toast } from "@acme/ui/toast";

import { classByCodes } from "~/lib/third-term/constants";

export default function Page() {
  return (
    <div>
      <Button
        onClick={() => {
          truncateData().then((re) => {
            console.log(re);
          });
        }}
      >
        Reset
      </Button>
      <div className="">
        <DropdownMenu>
          <DropdownMenuTrigger>Dump</DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.entries(classByCodes).map(([code, title]) => {
              return (
                <DropdownMenuItem
                  onClick={() => {
                    dumpStudentData(code as any)
                      .then((result) => {
                        console.log(result);
                      })
                      .catch((e) => {
                        console.log(e.message);
                        toast.error(e.message);
                      });
                  }}
                  key={code}
                >
                  {title}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
