import { useEffect } from "react";

import { initStore } from "~/lib/third-term/store";

export const useStoreInit = () => {
  useEffect(() => {
    initStore();
  }, []);
};
