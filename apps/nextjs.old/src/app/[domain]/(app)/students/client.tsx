"use client";

import { use } from "react";
import Link from "next/link";

import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { DataTable } from "@acme/ui/common/data-table/index";
import { TableCell } from "@acme/ui/common/data-table/table-cells";
import { useDataTable } from "@acme/ui/common/data-table/use-data-table-columns";
import { Menu } from "@acme/ui/common/menu";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";

import type { StudentsList } from "~/data-access/students.dta";
import {
  setStudentClass,
  updateStudentClass,
} from "~/data-access/classrooms.dta";
import { useClassrooms } from "~/hooks/use-classrooms";
import { _revalidate } from "~/lib/revalidate";
import Title from "../_components/header/title";

interface Props {
  // data?: StudentsList;
  resp;
}
export default function Client({ resp }: Props) {
  const data: StudentsList = use(resp);
  const PaymentStatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const colorMap = {
      Paid: "bg-green-500",
      Pending: "bg-yellow-500",
      Overdue: "bg-red-500",
    };
    return <Badge className={`${colorMap[status]} text-white`}>{status}</Badge>;
  };

  const classCtx = useClassrooms({
    loadOnInit: true,
  });
  const table = useDataTable(
    data,
    {
      cellVariants: {
        size: "sm",
      },
      checkable: false,
    },
    (ctx) => [
      ctx.Column("data", ({ item }) => (
        <TableCell>
          <TableCell.Primary>{item.fullName}</TableCell.Primary>
          <TableCell.Secondary>{item.classRoom}</TableCell.Secondary>
        </TableCell>
      )),
    ],
  );
  return (
    <>
      <Title>Students</Title>
      <div className="fixed bottom-0 right-0 m-4 mb-12">
        <Button asChild size={"icon"}>
          <Link href="/student/create">+</Link>
        </Button>
      </div>
      <DataTable {...(table.props as any)}>
        <DataTable.Table />
      </DataTable>
    </>
  );
  return (
    <>
      <div className="fixed bottom-0 right-0 m-4 mb-12">
        <Button asChild size={"icon"}>
          <Link href="/student/create">+</Link>
        </Button>
      </div>
      {/* Table for larger screens */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Payment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* {data?.map((student) => (
              <TableRow key={student.id}>
                <TableCell> {student.SessionClass?.classRoom?.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>
                  <PaymentStatusBadge status={student.paymentStatus} />
                </TableCell>
              </TableRow>
            ))} */}
          </TableBody>
        </Table>
      </div>

      {/* Cards for smaller screens */}
      <div className="space-y-4 md:hidden">
        {data?.map((student) => (
          <Card className="" key={student.id}>
            <CardHeader>
              <CardTitle>{student.fullName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Badge
                  variant={student.currentTerm ? undefined : "outline"}
                  className="mb-2 text-sm"
                >
                  {student.classRoom}
                </Badge>
                <div className="flex-1"></div>
                <Menu>
                  {!student.currentTerm ? (
                    <Menu.Item
                      SubMenu={
                        <>
                          <Menu.Item>Previous Class</Menu.Item>
                          {classCtx.classRooms?.map((c) => (
                            <Menu.Item
                              key={c.id}
                              onClick={async () => {
                                await setStudentClass({
                                  sessionClassId: c.id,
                                  studentId: student.id,
                                });
                                await _revalidate("students");
                              }}
                            >
                              {c.classRoom?.name}
                            </Menu.Item>
                          ))}
                        </>
                      }
                    >
                      Set Class
                    </Menu.Item>
                  ) : (
                    <>
                      <Menu.Item
                        SubMenu={
                          <>
                            {classCtx.classRooms?.map((c) => (
                              <Menu.Item
                                onClick={async () => {
                                  // console.log(student.currentTerm);
                                  // return;
                                  await updateStudentClass({
                                    sessionClassId: c.id,
                                    termSheetId: student.currentTerm.id,
                                  });
                                  await _revalidate("students");
                                }}
                                key={c.id}
                              >
                                {c.classRoom?.name}
                              </Menu.Item>
                            ))}
                          </>
                        }
                      >
                        Change Class
                      </Menu.Item>
                    </>
                  )}
                </Menu>
              </div>
              {/* <PaymentStatusBadge status={student.paymentStatus} /> */}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
