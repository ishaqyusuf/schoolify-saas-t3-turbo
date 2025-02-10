"use server";

import { revalidatePath } from "next/cache";

const _path = {
  students: "/[domain]/students",
};
export type RevalidatePaths = keyof typeof _path;
export async function _revalidate(pathName: RevalidatePaths) {
  const path = _path[pathName];
  await revalidatePath(path, "page");
}
