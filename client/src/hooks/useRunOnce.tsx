import { useEffect, useRef } from "react";

const useRunOnce = (effect: () => void) => {

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      effect();
      hasRun.current = true;
    }
  }, [effect]);
  
};

export default useRunOnce;
