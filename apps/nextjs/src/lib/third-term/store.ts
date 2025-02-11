import { loadDataAction } from "actions/load-data";
import { FieldPath, FieldPathValue } from "react-hook-form";
import { create } from "zustand";

import { dotSet } from "../utils";

const data: Partial<{
  studentData: {
    raw: string;
    studentsByClass: {
      classCode: string;
      students: {}[];
    }[];
  };
  questions: {
    id;
    data: {
      raw: string;
      subjectCode: string;
      classCode: string;
    };
  }[];
  dataLoaded: boolean;
}> = {};
type Action = ReturnType<typeof funcs>;
export type Data = typeof data;
type Store = Data & Action;
export type ZusFormSet = (update: (state: Data) => Partial<Data>) => void;

function funcs(set: ZusFormSet) {
  return {
    reset: (resetData) =>
      set((state) => ({
        ...data,
        ...resetData,
      })),
    update: <K extends FieldPath<Data>>(k: K, v: FieldPathValue<Data, K>) =>
      set((state) => {
        const newState = {
          ...state,
        };
        const d = dotSet(newState);
        d.set(k, v);
        return newState;
      }),
  };
}
export const dataStore = create<Store>((set) => ({
  ...data,
  ...funcs(set),
}));
export async function initStore() {
  const store = dataStore.getState();
  if (!store.dataLoaded) {
    const { result } = await loadDataAction();
    store.reset(result);
  }
}
