import { useEffect, useState } from "react";

import { ClassroomList, getClassrooms } from "~/data-access/classrooms.dta";

interface Props {
  loadOnInit?: boolean;
}
export function useClassrooms({ loadOnInit }: Props) {
  const [classRooms, setClassRooms] = useState<ClassroomList>([]);
  useEffect(() => {
    if (loadOnInit) reload().then();
  }, []);
  async function reload() {
    setClassRooms(await getClassrooms());
  }
  return {
    classRooms,
    reload,
  };
}
