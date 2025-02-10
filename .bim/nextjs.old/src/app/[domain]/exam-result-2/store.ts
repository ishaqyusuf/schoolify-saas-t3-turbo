import { create } from "zustand";

import type { ClassData, newClassData } from "./helper";

const defaultStoreData = {
  abc: "",
  searchParams: {
    "class-q": null,
    "result-q": null,
    sort: null,
    pageSize: "half2",
    result: null,
  },
  classData: [] as ClassData[],
  filteredData: [] as ClassData[],
  searchOptions: {
    "class-q": [] as any,
    "result-q": ["list", "result"],
    sort: ["name", "grade", "default"],
    pageSize: ["full", "half2", "half", "half3"],
    result: ["all", "over60"],
  },
};
type StoreData = typeof defaultStoreData;
export type StoreSet = (
  update: (state: StoreData) => Partial<StoreData>,
) => void;
const storeFn = (set: StoreSet) => {
  return {
    filterData: () =>
      set((state) => {
        const newState = { ...state };
        const filter = newState.searchParams;
        newState.filteredData = //[...newState.classData]
          JSON.parse(JSON.stringify(newState.classData))
            .filter((cls) => {
              if (filter["class-q"])
                return cls.class.localeCompare(filter["class-q"]) == 0;
              return true;
            })
            .map((c) => {
              c.students = c.students
                .sort(
                  filter.sort == "name"
                    ? (a, b) => a.fullName?.localeCompare(b.fullName, ["ar"])
                    : filter.sort == "grade"
                      ? (a, b) => b.totalScore - a.totalScore
                      : undefined,
                )
                .filter((student) => {
                  if (filter.result == "over60") {
                    return student.printable;
                  }

                  return true;
                });
              return c;
            });
        return newState;
      }),
    reset: (data) =>
      set((state) => {
        return {
          ...state,
          classData: [],
        };
      }),
    insertClassData: (data: ClassData) =>
      set((state) => {
        const newState = { ...state };
        newState.classData.push(data);
        return newState;
      }),
    setQuery: (k, v) =>
      set((state) => {
        const newState = { ...state };
        newState.searchParams[k] = v;
        return newState;
      }),
    composeFinish: () =>
      set((state) => {
        const newState = { ...state };
        newState.classData = newState.classData.filter(
          (a, i) =>
            i == newState.classData.findIndex((_a) => a.class == _a.class),
        );
        newState.searchOptions["class-q"] = [{ label: "All", value: null }];
        newState.classData?.map((c) => {
          newState.searchOptions["class-q"].push({
            label: `${c.class} (${c.students?.length})`,
            value: `${c.class}`,
          });
        });
        return newState;
      }),
  };
};
type StoreAction = ReturnType<typeof storeFn>;
export type StoreType = StoreData & StoreAction;
export const examStore = create<StoreType>((set) => ({
  ...defaultStoreData,
  ...storeFn(set as any),
}));
